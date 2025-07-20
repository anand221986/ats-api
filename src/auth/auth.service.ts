import {
  Injectable,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { UtilService } from 'src/util/util.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { SignUpDto } from './dto/signup.dto';
import { DbService } from "../db/db.service";
import * as bcrypt from 'bcrypt';



import { 
  CognitoIdentityProviderClient, 
  SignUpCommand,InitiateAuthCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class AuthService {
  private readonly secretKey: string;
  private readonly apiKey: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly utilService: UtilService,
    public dbService: DbService,
  ) {
    const userPoolId = this.config.get<string>('COGNITO_USER_POOL_ID');
    this.clientId = this.config.get<string>('COGNITO_CLIENT_ID')!;
    this.clientSecret = this.config.get<string>('COGNITO_CLIENT_SECRET')!;  // Added this line
    this.secretKey = this.config.get<string>('JWT_SECRET') || '';
    this.apiKey = this.config.get<string>('API_KEY') || '';
    console.log(this.config.get<string>('COGNITO_USER_POOL_ID'))
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.config.get<string>('AWS_REGION') || 'eu-north-1',
    });
    if (!userPoolId || !this.clientId || !this.clientSecret) {
      throw new Error('Missing Cognito config values');
    }
  }

  //sign up code 
  async signUp(request: { email: string; password: string; name: string, phone_number: string }): Promise<any> {
    const { email, password, name, phone_number } = request;
    const secretHash = this.utilService.generateSecretHash(email, this.clientId, this.clientSecret);
     const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: password,
      SecretHash: secretHash,
      UserAttributes: [
        {
          Name: 'email',
          Value: request.email,
        },
        {
          Name: 'name',
          Value: request.name,
        },
        {
          Name: 'phone_number',
          Value: request.phone_number, // Use E.164 format. Example: +11234567890 for US.
        },
      ],
    });
    try {
      const response = await this.cognitoClient.send(command);
      const newUser = {
        email,
        name,
        cognitoId: response.UserSub,
        createdAt: new Date(),
      };
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ');
      const usercreatePayload = {
        first_name: firstName,
        last_name: lastName || '',
        email,
        phone: phone_number,
        created_dt: new Date(),
        email_verified: 0,
        phone_verified: 0,
        password: hashedPassword,
        cognitoId: response.UserSub // Add this
      };
      // Optional DB sync
     return  await this.createUser(usercreatePayload);
    } catch (error) {
      if (error.name === 'UsernameExistsException') {
        throw new BadRequestException('User already exists');
      }

      // Add more specific Cognito errors as needed
      throw new BadRequestException(error.message || 'Signup failed');
    }


  }

  getToken(userId, userEmail) {
    const tokenCreationTime = Math.floor(Date.now() / 1000);
    const jti = uuidv4();
    const payload = {
      iss: this.apiKey,
      iat: tokenCreationTime,
      jti: jti,
      sub: userId,
      email: userEmail
    };
    const token = jwt.sign(payload, this.secretKey);
    return token;
  }

  async createUser(usercreatePayload) {
    try {
      //const hashedPassword = await bcrypt.hash(usercreatePayload.password, 10); // 10 is the salt rounds
      const setData = [
        { set: 'first_name', value: String(usercreatePayload.first_name) },
        { set: 'last_name', value: String(usercreatePayload.last_name) },
        { set: 'email', value: String(usercreatePayload.email) },
        { set: 'password', value: String(usercreatePayload.password?? '') },
        { set: 'phone', value: String(usercreatePayload.phone_number ?? '') },
      ]
      const insertion = await this.dbService.insertData('users', setData);
      return this.utilService.successResponse(insertion, 'User created successfully.');
    } catch (error) {
      console.error('Create User Error:', error);
      throw error;
    }
  }

 async signIn(request: { email: string; password: string }): Promise<any> {
  const { email, password } = request;
  const secretHash = this.utilService.generateSecretHash(email, this.clientId, this.clientSecret);

  const command = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: this.clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: secretHash,
    },
  });

  try {
    const response = await this.cognitoClient.send(command);

    const authResult = response.AuthenticationResult;
    if (!authResult) {
      throw new UnauthorizedException('Authentication failed');
    }

    const { IdToken, AccessToken, RefreshToken } = authResult;
    return {
      accessToken: AccessToken,
      idToken: IdToken,
      refreshToken: RefreshToken,
    };

  } catch (err) {
    console.error('Cognito sign-in error:', err);
    throw new UnauthorizedException('Invalid email or password');
  }
}

  async forgotPassword(email: string): Promise<any> {
    const secretHash = this.utilService.generateSecretHash(email, this.clientId, this.clientSecret);
    
    const command = new ForgotPasswordCommand({
      ClientId: this.clientId,
      Username: email,
      SecretHash: secretHash,
    });

    try {
      const response = await this.cognitoClient.send(command);
      return {
        success: true,
        message: 'Password reset code sent to your email',
        codeDeliveryDetails: response.CodeDeliveryDetails
      };
    } catch (err) {
      console.error('Cognito forgot password error:', err);
      throw new BadRequestException(err.message || 'Failed to initiate password reset');
    }
  }

  async resetPassword(email: string, verificationCode: string, newPassword: string): Promise<any> {
    const secretHash = this.utilService.generateSecretHash(email, this.clientId, this.clientSecret);
    
    const command = new ConfirmForgotPasswordCommand({
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: verificationCode,
      Password: newPassword,
      SecretHash: secretHash,
    });

    try {
      await this.cognitoClient.send(command);
      return {
        success: true,
        message: 'Password has been reset successfully'
      };
    } catch (err) {
      console.error('Cognito reset password error:', err);
      throw new BadRequestException(err.message || 'Failed to reset password');
    }
  }
}

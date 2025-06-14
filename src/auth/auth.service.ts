import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { UtilService } from 'src/util/util.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
 
import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';

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

    console.log(userPoolId,this.clientId,this.clientSecret)

    if (!userPoolId || !this.clientId || !this.clientSecret) {
      throw new Error('Missing Cognito config values');
    }

  
  }

  async signUp(email: string, password: string, name: string): Promise<any> {
 
    const secretHash = this.utilService.generateSecretHash(email, this.clientId, this.clientSecret);
    console.log('secretHash:', secretHash);
console.log('email:', email);
console.log('clientId:', this.clientId);
console.log('clientSecret:', this.clientSecret);
const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: password,
      SecretHash: secretHash,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'name',
          Value: name,
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
      console.log(newUser)

      // Optional DB sync
      // await this.userService.create(newUser);

        } catch (err) {
      console.error('Cognito signup error:', err);
      throw new BadRequestException(err.message || 'Signup failed');
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
}

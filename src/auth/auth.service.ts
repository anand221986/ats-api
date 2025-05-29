import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UtilService } from 'src/util/util.service';
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";

@Injectable()
export class AuthService {
  private readonly secretKey = '';
  private readonly apiKey = '';

  constructor(private readonly jwtService: JwtService, private utilService: UtilService, @Inject(forwardRef(() => UserService)) private readonly userService: UserService) { }

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

  getFreeSurfingToken() {
    const tokenCreationTime = Math.floor(Date.now() / 1000);
    const jti = uuidv4();
    const payload = {
      iss: this.apiKey,
      iat: tokenCreationTime,
      jti: jti
    };
    const token = jwt.sign(payload, this.secretKey);
    return token;
  }

  async verifyToken(token: string) {
    try {
      this.jwtService.verify(token, { secret: this.secretKey });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Handle Google SSO login
   */
  async validateGoogleLogin(profile: any): Promise<{ accessToken: string, user: any }> {
    // Extract user details from Google profile
    const { id, emails, displayName, photos } = profile;
    const email = emails?.[0]?.value;
    const avatar = photos?.[0]?.value;

    if (!email) {
      throw new UnauthorizedException('Google login failed: Email not found');
    }

    // Check if user exists in DB, otherwise create new user
    let user = await this.userService.registerGoogleAuth(profile);
    if (user.status === false) {
      // throw new UnauthorizedException('Google login failed: Email not found');
      // throw this.utilService.failResponse("No such user exists");
    }
    // Generate a JWT token
    const accessToken = this.getToken(user.id, user.email);
    return { accessToken, user };
  }

  async generateAwsSamlOrStsToken(params: {
    email: string;
    name: string;
    roleArn: string;
  }): Promise<any> {
    const { roleArn, email } = params;

    // const stsClient = new STSClient({
    //   region: this.utilService.AWS_REGION,
    //   credentials: {
    //     accessKeyId: this.utilService.AWS_ACCESS_KEY_ID,
    //     secretAccessKey: this.utilService.AWS_SECRET_ACCESS_KEY,
    //   }
    // });
    const sessionName = email.split('@')[0]; // A short name for the session

    const assumeRoleCommand = new AssumeRoleCommand({
      RoleArn: roleArn,
      RoleSessionName: sessionName,
      DurationSeconds: 3600, // 1 hour
    });
    try {
      // const result = await stsClient.send(assumeRoleCommand);
      // return {
      //   accessKeyId: result.Credentials?.AccessKeyId,
      //   secretAccessKey: result.Credentials?.SecretAccessKey,
      //   sessionToken: result.Credentials?.SessionToken,
      //   expiration: result.Credentials?.Expiration
      // };
    } catch (error) {
      console.error('Failed to assume AWS role:', error);
      throw new UnauthorizedException('AWS role assumption failed');
    }
  }

   

}
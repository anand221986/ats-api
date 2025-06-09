import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UtilService } from 'src/util/util.service';
import { ConfigService } from '@nestjs/config';

import {
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

@Injectable()
export class AuthService {
  private readonly userPool: CognitoUserPool;
  private readonly secretKey: string;
  private readonly apiKey: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly utilService: UtilService,
  ) {
    const userPoolId = this.config.get<string>('COGNITO_USER_POOL_ID');
    this.clientId = this.config.get<string>('COGNITO_CLIENT_ID')!;
    //this.clientSecret = this.config.get<string>('COGNITO_CLIENT_SECRET')!;  // Added this line
    this.secretKey = this.config.get<string>('JWT_SECRET') || '';
    this.apiKey = this.config.get<string>('API_KEY') || '';
    console.log(this.config.get<string>('COGNITO_USER_POOL_ID'))

    console.log(userPoolId,this.clientId,this.clientSecret)

    if (!userPoolId || !this.clientId ) {
      throw new Error('Missing Cognito config values');
    }

    this.userPool = new CognitoUserPool({
      UserPoolId: userPoolId,
      ClientId: this.clientId,
    });
  }

  async signUp(email: string, password: string, name: string): Promise<any> {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'name', Value: name }),
    ];

    const secretHash = this.utilService.generateSecretHash(email, this.clientId, this.clientSecret);

    return new Promise((resolve, reject) => {
      this.userPool.signUp(email, password, attributeList, [], async (err, result) => {
        if (err) {
          return reject(new BadRequestException(err.message || 'Signup failed'));
        }

        const newUser = {
          email,
          name,
          cognitoId: result?.userSub,
          createdAt: new Date(),
        };

        try {
          console.log(newUser, 'new user');
          // await this.userService.create(newUser);
          resolve({ message: 'User signed up successfully', userSub: result?.userSub });
        } catch (dbErr) {
          reject(new BadRequestException('Failed to sync user to database'));
        }
      });
    });
  }
}

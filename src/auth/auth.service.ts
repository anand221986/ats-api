import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UtilService } from 'src/util/util.service';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import { ConfigService } from '@nestjs/config';

import {
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

@Injectable()
export class AuthService {
  private readonly userPool: CognitoUserPool;
  private readonly secretKey: string;
  private readonly apiKey: string;

  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly utilService: UtilService,
  ) {
    const userPoolId = this.config.get('COGNITO_USER_POOL_ID')!;
    const clientId = this.config.get('COGNITO_CLIENT_ID')!;
    this.secretKey = this.config.get<string>('JWT_SECRET') || '';
    this.apiKey = this.config.get<string>('API_KEY') || '';

    if (!userPoolId || !clientId) {
      throw new Error('Missing Cognito config values');
    }

    this.userPool = new CognitoUserPool({
      UserPoolId: userPoolId,
      ClientId: clientId,
    });
  }

  async signUp(email: string, password: string, name: string): Promise<any> {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'name', Value: name }),
    ];

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

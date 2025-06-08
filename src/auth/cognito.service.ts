import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { Injectable } from '@nestjs/common';

const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;

if (!userPoolId || !clientId) {
  throw new Error('Missing required environment variables: COGNITO_USER_POOL_ID or COGNITO_CLIENT_ID');
}

const poolData = {
  UserPoolId: userPoolId,
  ClientId: clientId,
};
const userPool = new CognitoUserPool(poolData);
@Injectable()
export class CognitoService {
  async signUp(email: string, password: string, role: string): Promise<any> {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
    ];
    return new Promise((resolve, reject) => {
      userPool.signUp(email, password, attributeList, [], (err, result) => {
        if (err) return reject(err);
        // Assign group using adminSetUser
        resolve(result);
      });
    });
  }

  async signIn(email: string, password: string): Promise<any> {
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    return new Promise((resolve, reject) => {
      user.authenticateUser(authDetails, {
        onSuccess: (result) => resolve(result),
        onFailure: (err) => reject(err),
      });
    });
  }
}

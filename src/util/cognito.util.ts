import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";
export class CognitoUtil {
  private cognitoClient: CognitoIdentityProviderClient;
  private userPoolId: string;
  constructor(userPoolId: string, region: string) {
    this.userPoolId = userPoolId;
    this.cognitoClient = new CognitoIdentityProviderClient({ region });
  }
  async updateCognitoUser(
    email: string,
    updates: { name?: string; phone_number?: string; status?: number ;email_verified?:boolean;phone_verified:boolean}
  ) {
    const attributes: { Name: string; Value: string }[] = [];

    if (updates.name) {
      attributes.push({ Name: "name", Value: updates.name });
    }

    if (updates.phone_number) {
      attributes.push({ Name: "phone_number", Value: updates.phone_number });
    }

    // ✅ status sync (stored as custom attribute)
    if (updates.status !== undefined) {
      attributes.push({ Name: "custom:status", Value: String(updates.status) });
    }
     // ✅ status sync (stored as custom attribute)
    if (updates.status !== undefined) {
      attributes.push({ Name: "custom:status", Value: String(updates.status) });
    }
    // Email verified (boolean → 'true'/'false')
  if (updates.email_verified !== undefined) {
    attributes.push({
      Name: "email_verified",
      Value: updates.email_verified ? "true" : "false",
    });
  }

   if (updates.phone_verified !== undefined) {
    attributes.push({
      Name: "phone_verified",
      Value: updates.phone_verified ? "true" : "false",
    });
  }

  
    

    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.userPoolId,
      Username: email,
      UserAttributes: attributes,
    });

    return await this.cognitoClient.send(command);
  }

  // 🔹 Assign Cognito user to a group
  async assignUserToGroup(email: string, groupName: string) {
    const command = new AdminAddUserToGroupCommand({
      UserPoolId: this.userPoolId,
      Username: email,
      GroupName: groupName,
    });

    return await this.cognitoClient.send(command);
  }
 


}
import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards, Body } from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { ApiTags } from "@nestjs/swagger";
import { OAuth2Client } from 'google-auth-library';
import { UtilService } from 'src/util/util.service';

@Controller("auth")
@ApiTags("Authentication")
export class AuthController {
    private googleClient: OAuth2Client;

    constructor(
        public authService: AuthService, private utilService: UtilService
    ) {
        this.googleClient = new OAuth2Client();
    }

    // /**
    //  * Redirects user to Google OAuth
    //  */
    // @Get('google')
    // @UseGuards(AuthGuard('google'))
    // googleAuth() {
    //     // This endpoint will redirect to Google
    //     return { message: 'Redirecting to Google for authentication' };
    // }

    // /**
    //  * Google OAuth callback
    //  */
    // @Get('google/callback')
    // @UseGuards(AuthGuard('google'))
    // async googleAuthRedirect(@Req() req, @Res() res: Response) {
    //     try {
    //         // The user object will contain the profile and JWT token from our GoogleStrategy
    //         const { profile, accessToken } = req.user;
            
    //         // Return success response with token
    //         res.status(HttpStatus.OK).json({
    //             message: "Login successful",
    //             accessToken,
    //             user: {
    //                 id: profile.id,
    //                 email: profile.emails[0].value,
    //                 name: profile.displayName,
    //                 picture: profile.photos[0].value
    //             }
    //         });
    //     } catch (error) {
    //         res.status(HttpStatus.UNAUTHORIZED).json({
    //             message: "Google authentication failed",
    //             error: error.message
    //         });
    //     }
    // }

    // @Post('google/verify-token')
    //     async verifyGoogleToken(@Body() body: { credential: string }, @Res() res: Response) {
    //         try {
    //             const { credential } = body;
                
    //             // Verify the Google token
    //             const ticket = await this.googleClient.verifyIdToken({
    //                 idToken: credential,
    //                 audience: this.utilService.GOOGLE_CLIENT_ID
    //             });

    //             const payload = ticket.getPayload();
    //             // Create a profile object similar to what we get from OAuth2
    //             const profile = {
    //                 id: payload.sub,
    //                 emails: [{ value: payload.email }],
    //                 displayName: payload.name,
    //                 photos: [{ value: payload.picture }]
    //             };

    //             // Use the existing validateGoogleLogin method
    //             const { accessToken: jwtToken, user } = await this.authService.validateGoogleLogin(profile);
    //             const awsRole = this.authService.mapUserRoleToAwsRole(user.type); // <- you define this
    //             const awsResponse = await this.authService.generateAwsSamlOrStsToken({
    //                 email: user.email,
    //                 name: user.name,
    //                 roleArn: awsRole
    //             });
    //             res.status(HttpStatus.OK).json({
    //                 status: true,
    //                 result: {
    //                     token: jwtToken,
    //                     user: {
    //                         id: profile.id,
    //                         email: profile.emails[0].value,
    //                         name: profile.displayName,
    //                         picture: profile.photos[0].value,
    //                         type: user.type,
    //                         designation: user.designation,
    //                         sessionToken: awsResponse.sessionToken // <- this can be SAML assertion or STS creds
    //                     }
    //                 }
    //             });
    //         } catch (error) {
    //             console.error('Token verification error:', error);
    //             res.status(HttpStatus.ACCEPTED).json({
    //                 status: false,
    //                 message: "Google token verification failed",
    //                 error: error.message
    //             });
    //         }
    //     }
}

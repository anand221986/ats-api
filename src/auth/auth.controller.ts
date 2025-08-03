import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards, Body,BadRequestException, Param, } from "@nestjs/common";
import { CognitoService } from './cognito.service';
import { UserService } from '../user/user.service';
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { OAuth2Client } from 'google-auth-library';
import { UtilService } from 'src/util/util.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto,SignInDto } from './dto/signup.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
@ApiTags('Auth')
@Controller("auth")
export class AuthController {
    private googleClient: OAuth2Client;
    constructor(
        public authService: AuthService, private utilService: UtilService
    ) {
        this.googleClient = new OAuth2Client();
    }

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user in Cognito and sync to DB' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ status: 201, description: 'User signed up successfully' })
  @ApiResponse({ status: 400, description: 'Signup failed or input error' })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

    @Post('signin')
  @ApiOperation({ summary: 'Authenticate user and return JWT tokens from Cognito' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, description: 'User signed in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Initiate password reset process' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset code sent to email' })
  @ApiResponse({ status: 400, description: 'Failed to initiate password reset' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using verification code' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Failed to reset password' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.verificationCode,
      resetPasswordDto.newPassword
    );
  }
@Get('generate-token')
  generateToken() {
    const userId = 'default-user-id';
    const email = 'default@example.com';
    const token = this.authService.getToken(userId, email);
    return { access_token: token };
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

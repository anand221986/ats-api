// src/auth/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly secretKey = "";
    private readonly apiKey = "";
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const apiKey = request.headers['x-api-key'];
        let token = request.headers['x-api-token'];

        // Check if API key is valid
        if (apiKey !== this.apiKey) {
            throw new ForbiddenException('Forbidden: Invalid API Key');
        }
        // token = Array.isArray(token) ? token[0] : token
        // // Verify the JWT token
        // try {
        //     jwt.verify(token, this.secretKey);
        // } catch (err) {
        //     throw new UnauthorizedException('Unauthorized: Invalid Token');
        // }

        return true; // Allow access
    }
}

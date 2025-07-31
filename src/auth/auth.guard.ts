import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  UnauthorizedException 
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly secretKey: string;

  constructor(private readonly config: ConfigService) {
    this.secretKey = this.config.get<string>('JWT_SECRET') || '';
    if (!this.secretKey) {
      throw new Error('JWT_SECRET is not configured');
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = this.extractTokenFromHeader(authHeader);
    if (!token) {
      throw new UnauthorizedException('Token is missing from authorization header');
    }
    try {
      const payload = jwt.verify(token, this.secretKey) as any;
      if (!payload.sub || !payload.email) {
        throw new UnauthorizedException('Invalid token payload');
      }
      request.user = {
        userId: payload.sub,
        email: payload.email,
        iat: payload.iat,
        jti: payload.jti
      };

      return true;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }
      if (error instanceof jwt.NotBeforeError) {
        throw new UnauthorizedException('Token not active yet');
      }
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token validation failed');
    }
  }

  private extractTokenFromHeader(authHeader: string): string | null {
    const [type, token] = authHeader.split(' ');
    
    if (type !== 'Bearer') {
      throw new UnauthorizedException('Authorization header must be in Bearer format');
    }
    
    return token || null;
  }
}
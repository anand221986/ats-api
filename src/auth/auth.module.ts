// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UtilService } from '../util/util.service';
import { DbService } from '../db/db.service';

@Module({
    imports: [
        ConfigModule,
        JwtModule.register({
            global: true,
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService, 
        AuthGuard, 
        UserService, 
        UtilService, 
        DbService
    ],
    exports: [AuthGuard, AuthService],
})
export class AuthModule {}
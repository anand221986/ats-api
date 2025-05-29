// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';


@Module({
    providers: [AuthGuard],
    exports: [AuthGuard], // Export if you want to use it in other modules
})
export class AuthModule {}
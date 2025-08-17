import { Module ,NestModule,MiddlewareConsumer} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonController } from './common/common.controller';
import { CommonService } from './common/common.service';
import { EmailService } from './email/email.service';
import { ApiMiddleware } from './middleware/api.middleware';
import { UtilService } from './util/util.service';
import { DbService } from './db/db.service';
import { ErrorLoggerService } from './error-logger/error-logger.service';
import { AesService } from './services/aes/aes.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { JobsController } from './jobs/jobs.controller';
import { JobsService} from './jobs/jobs.service';
import { CandidateService } from './candidate/candidate.service';
import { CandidateController } from './candidate/candidate.controller';
import { AuthController } from './auth/auth.controller';
import { ClientService } from './client/client.service';
import { ClientController } from './client/client.controller';
import {LinkedinService} from './linkedin/linkedin.service';
import { LinkedinController } from './linkedin/linkedin.controller';
import {ResumesService} from './resumes/resumes.service';
import { ResumesController } from './resumes/resumes.controller';
import {ActivityService} from './candidate/activity.service';
import {SettingService} from './setting/setting.service';
import {SettingsController} from './setting/setting.controller';



 
@Module({
  imports: [ ConfigModule.forRoot({
      isGlobal: true, // So you can use ConfigService anywhere without importing again
    }),],
  controllers: [AppController,CommonController,UserController,JobsController,CandidateController,AuthController,ClientController,LinkedinController,ResumesController,SettingsController],
  providers: [AppService,CommonService,UtilService,DbService,ErrorLoggerService,AesService,AuthService,JwtService,UserService,JobsService,CandidateService,AuthService,ClientService,LinkedinService,EmailService,ResumesService,ActivityService,SettingService ],
})
//with middle ware 
//without export class AppModule
 export class AppModule implements NestModule
  {
 configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiMiddleware).exclude()
      .forRoutes('*')
  }

}

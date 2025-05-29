import { Module ,NestModule,MiddlewareConsumer} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonController } from './common/common.controller';
import { CommonService } from './common/common.service';
import { ApiMiddleware } from './middleware/api.middleware';
import { UtilService } from './util/util.service';
import { DbService } from './db/db.service';
import { ErrorLoggerService } from './error-logger/error-logger.service';
import { AesService } from './services/aes/aes.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { JobsService } from './jobs/jobs.service';
import { JobsController } from './jobs/jobs.controller';
@Module({
  imports: [],
  controllers: [AppController,CommonController,UserController,JobsController],
  providers: [AppService,CommonService,UtilService,DbService,ErrorLoggerService,AesService,AuthService,JwtService,UserService,JobsService ],
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

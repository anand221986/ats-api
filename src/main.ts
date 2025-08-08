import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as https from 'https';
import * as compression from 'compression';
import helmet from 'helmet';
async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('/etc/ssl/private/ssl-cert-snakeoil.key'),
  //   cert: fs.readFileSync('/etc/ssl/certs/ssl-cert-snakeoil.pem'),
  // };
  let httpsOptions: { key: Buffer; cert: Buffer } | undefined = undefined;
 if( process.env.ENVIRONMENT === 'Production')
    httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/xbeeshire.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/xbeeshire.com/fullchain.pem'),
  };

  const app = await NestFactory.create(AppModule,  {
   ...(httpsOptions && { httpsOptions }),
     logger: ['error', 'warn', 'log', 'debug', 'verbose']} 
    );
app.use(compression());
app.use(helmet());
  // 👇 Allow requests from your React frontend (http://localhost:8081)
  app.enableCors({
    origin: ['http://localhost:8081','http://localhost:8080', 'http://ats-admin-panel.s3-website.eu-north-1.amazonaws.com','http://51.20.181.155','http://xbeeshire.com',
      'https://51.20.181.155','https://xbeeshire.com','http://192.168.137.1','http://10.10.134.213','http://13.51.235.31'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
   const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('API description')
    .setVersion('1.0')
    //.addBearerAuth() // optional: for JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // URL: /api
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

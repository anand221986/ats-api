import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as https from 'https';
async function bootstrap() {
 /* const httpsOptions = {
    key: fs.readFileSync('/etc/ssl/private/ssl-cert-snakeoil.key'),
    cert: fs.readFileSync('/etc/ssl/certs/ssl-cert-snakeoil.pem'),
  }; */
// httpsOptions,
  const app = await NestFactory.create(AppModule,  {
   
     logger: ['error', 'warn', 'log', 'debug', 'verbose']} 
    );

  // 👇 Allow requests from your React frontend (http://localhost:8081)
  app.enableCors({
    origin: ['http://localhost:8081','http://localhost:8080', 'http://ats-admin-panel.s3-website.eu-north-1.amazonaws.com','http://51.20.181.155','http://xbeeshire.com','https://51.20.181.155','https://xbeeshire.com'],
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

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Security & performance middlewares
  app.use(compression());
  app.use(helmet());
  //  app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,      // strips unknown fields
  //     forbidNonWhitelisted: true, // throw error if unknown fields
  //     transform: true,      // auto-transform payloads to DTO classes
  //   }),
  // );

  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:8081',
      'http://localhost:8080',
      'http://ats-admin-panel.s3-website.eu-north-1.amazonaws.com',
      'http://51.20.181.155',
      'http://xbeeshire.com',
      'https://51.20.181.155',
      'https://xbeeshire.com',
      'http://192.168.137.1',
      'http://10.10.134.213',
      'http://13.51.235.31',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Only enable Swagger in non-production environments
  if (process.env.ENVIRONMENT !== 'Production') {
    const config = new DocumentBuilder()
      .setTitle('Your API Title')
      .setDescription('API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

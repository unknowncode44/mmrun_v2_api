import { config } from 'dotenv';
config()

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/modules/app.module';

import * as nodemailer from 'nodemailer'
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';


export const transporter = nodemailer.createTransport({
  host: process.env.SMTP,
  port: 465,
  secure: true,
  auth: {
      user: process.env.EMAIL, // Email
      pass: process.env.PASSWORD, // Contraseña
  }
})
transporter.verify().then(() => {
  console.log('Mailer Online')
})


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true
  });
  
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('MMRun v2.0 example')
    .setDescription('MMRun v2.0 API description')
    .setVersion('1.0')
    .addTag('mmrun')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3040);
}
bootstrap();

import { config } from 'dotenv';
config()

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/modules/app.module';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
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

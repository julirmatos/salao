import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Salão Thais Jacome')
    .setDescription('Sistema de agendamento de salão')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  
  process.env.TZ = '-03:00';

  // Aplicando os recursos de validação
  app.useGlobalPipes(new ValidationPipe());

  // Habilitando o CORS do projeto
  app.enableCors();

  // Indico qual porta o projeto está sendo executado
  await app.listen(4000);
}

bootstrap();

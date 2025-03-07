import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração de CORS
  app.enableCors();
  
  // Pipes para validação
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Filtros e interceptores globais
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Aluguel de Quartos')
    .setDescription('API para sistema de aluguel de quartos similar ao Airbnb')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Prefixo global para todas as rotas
  app.setGlobalPrefix('api/v1');
  
  await app.listen(process.env.PORT || 3000);
  console.log(`Aplicação rodando na porta ${process.env.PORT || 3000}`);
}

bootstrap();
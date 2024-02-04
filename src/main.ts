import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExceptionService } from './exception/exception.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ExceptionService());
  const config = new DocumentBuilder()
    .setTitle('Maestro API')
    .setDescription('Maestro API Documentation')
    .setVersion('1.0')
    .addTag('Maestro')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3030);
  console.log(`Application is running on: ${await app.getUrl()}/api`);
}
bootstrap();

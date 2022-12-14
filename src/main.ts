import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Travelerbies')
    .setDescription('The Blog API description')
    .setVersion('4.15.0')
    .addBearerAuth(undefined, 'JWT_Refresh')
    .addBearerAuth(undefined, 'Jwt_Token')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger-ui', app, document);

  await app.listen(3000);
}
bootstrap();

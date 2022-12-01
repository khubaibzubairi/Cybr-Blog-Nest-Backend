import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RefTokenDto } from './authentication/refToken.dto';
import { User } from './user/user.schema';

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

  // const options = {
  //   swaggerOptions: {
  //     authAction: {
  //       defaultBearerAuth: {
  //         name: 'WT_Refresh',
  //         schema: {
  //           description: 'Default',
  //           type: 'http',
  //           in: 'header',
  //           scheme: 'bearer',
  //           bearerFormat: 'JWT',
  //         },
  //         value: token.refreshToken,
  //       },
  //     },
  //   },
  // };

  SwaggerModule.setup('swagger-ui', app, document);

  await app.listen(3000);
}
bootstrap();

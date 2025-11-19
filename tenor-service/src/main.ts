import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Tenor Service API')
    .setDescription('API for GIF search and favorites')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`🚀 Tenor Service running at http://localhost:${port}`);
}
bootstrap();

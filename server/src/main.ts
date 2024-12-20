import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validation.pipe';

async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'fatal', 'debug']
    });

    app.enableCors();

    const config = new DocumentBuilder()
      .setTitle("Transaction platform")
      .setDescription("REST API Documentation")
      .setVersion("1.0.0")
      .addTag("Sinzem")
      .build()
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api/docs', app, document);

      app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

start();
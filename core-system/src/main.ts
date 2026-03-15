import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }),
  );

  console.log(process.env.CORE_SYSTEM_PORT)
  await app.listen(process.env.CORE_SYSTEM_PORT ?? 3000);
}
bootstrap();

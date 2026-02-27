import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(process.env.CORE_SYSTEM_PORT)
  await app.listen(process.env.CORE_SYSTEM_PORT ?? 3000);
}
bootstrap();

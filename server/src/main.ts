import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  //Config & App
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  //DTO validation
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  //Start App
  await app.listen(config.get<number>('port'));
}
bootstrap();

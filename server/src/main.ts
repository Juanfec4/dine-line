import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminService } from './iam/services/admin/admin.service';

async function bootstrap() {
  //Config & App
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  //Create app admin
  const username = config.get<string>('admin.username');
  const password = config.get<string>('admin.password');
  const adminService = app.get<AdminService>(AdminService);
  await adminService.create(username, password);

  //DTO validation
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  //Start App
  await app.listen(config.get<number>('port'));
}
bootstrap();

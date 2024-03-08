import { Module } from '@nestjs/common';

import { ImageController } from './image.controller';
import { MulterModule } from '@nestjs/platform-express';
import { IamModule } from 'src/iam/iam.module';
import { ImageService } from './image.service';

@Module({
  imports: [MulterModule.register({ dest: './public/uploads' }), IamModule],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}

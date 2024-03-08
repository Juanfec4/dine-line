import { ImageService } from './image.service';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import path, { extname } from 'path';
import { FOUR_HUNDRED_KB } from 'src/common/constants';
import { AdminRoute } from 'src/common/decorators/admin-route.decorator';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @AdminRoute()
  @Post('/')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: path.join(process.cwd(), 'public', 'media'),
        filename: (req, file, callback) => {
          const fileExtName = extname(file.originalname);
          const randomName = nanoid(10);
          callback(null, `${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: FOUR_HUNDRED_KB }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return { fileName: file.filename };
  }
  @AdminRoute()
  @Delete('/:fileName')
  async deleteFile(@Param('fileName') fileName: string) {
    return await this.imageService.deleteFile(fileName);
  }
}

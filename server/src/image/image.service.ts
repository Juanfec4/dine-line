import { Injectable, NotFoundException } from '@nestjs/common';
import path from 'path';
import { promises as fs } from 'fs';
@Injectable()
export class ImageService {
  async deleteFile(fileName: string) {
    const filePath = path.join(process.cwd(), 'public', 'media', fileName);
    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      throw new NotFoundException('File does not exist.');
    }
  }

  async isValidFile(fileName: string) {
    const filePath = path.join(process.cwd(), 'public', 'media', fileName);
    let file: any = null;
    try {
      file = await fs.readFile(filePath);
    } catch (error: any) {}
    return file !== null;
  }
}

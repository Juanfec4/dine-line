import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class HashingService {
  async hash(input: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(input, salt);
    return hash;
  }

  async compare(input: string, hash: string) {
    const isValid = await bcrypt.compare(input, hash);
    return isValid;
  }
}

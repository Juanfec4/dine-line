import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class JwtService {
  private readonly refreshSecret: string;
  private readonly accessSecret: string;

  constructor(configService: ConfigService) {
    this.refreshSecret = configService.get<string>('jwt.refreshTokenSecret');
    this.accessSecret = configService.get<string>('jwt.accessTokenSecret');
  }

  async generateToken(
    type: 'access' | 'refresh',
    payload: { [key: string]: string | number },
    expiresIn: string,
  ) {
    let secret = this.getSecretByType(type);
    const token = await jwt.sign(payload, secret, { expiresIn });
    return token;
  }

  async verifyToken(type: 'access' | 'refresh', token: string) {
    let secret = this.getSecretByType(type);
    try {
      await jwt.verify(token, secret);
      return true;
    } catch (error: any) {
      return false;
    }
  }

  async decodeToken(token: string) {
    const result = await jwt.decode(token);
    return result as jwt.JwtPayload;
  }

  private getSecretByType(type: 'access' | 'refresh') {
    if (type === 'access') {
      return this.accessSecret;
    }

    if (type === 'refresh') {
      return this.refreshSecret;
    }
  }
}

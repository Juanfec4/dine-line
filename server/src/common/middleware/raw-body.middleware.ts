// raw-body.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl === '/stripe/webhooks') {
      req.setEncoding('utf8');
      req.rawBody = '';
      req.on('data', (chunk) => {
        req.rawBody += chunk;
      });
      req.on('end', () => {
        next();
      });
    } else {
      next();
    }
  }
}

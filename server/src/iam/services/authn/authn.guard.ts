import { IS_PUBLIC_KEY } from './../../../common/decorators/public.decorator';
import { JwtService } from './../jwt/jwt.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AdminService } from '../admin/admin.service';
import { IS_ADMIN_ROUTE_KEY } from 'src/common/decorators/admin-route.decorator';

@Injectable()
export class AuthnGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //Is public reflector
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isAdminRoute = this.reflector.getAllAndOverride<boolean>(
      IS_ADMIN_ROUTE_KEY,
      [context.getHandler(), context.getClass()],
    );

    //Skip if it is a public route
    if (isPublic) {
      return true;
    }

    //Get token from request
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    //If no token throw error
    if (!token) {
      throw new UnauthorizedException('Missing Auth Bearer.');
    }

    try {
      const isValid = await this.jwtService.verifyToken('access', token);

      //If invalid token throw error
      if (!isValid) {
        throw new UnauthorizedException('Invalid Access Token.');
      }

      //Add payload sub to request
      const payload = await this.jwtService.decodeToken(token);

      //Check if it is admin
      if (parseInt(payload.isAdmin) === 1) {
        if (isAdminRoute) {
          const admin = await this.adminService.getById(Number(payload.sub));

          if (!admin) {
            throw new UnauthorizedException('Invalid Access Token.');
          }
          return true;
        }
        throw new UnauthorizedException('Invalid Access Token.');
      }

      request['userId'] = parseInt(payload.sub);
    } catch (error: any) {
      throw new UnauthorizedException('Invalid Access Token.');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// src/auth/jwt-auth.guard.ts

import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);
  
  canActivate(context: ExecutionContext) {
    this.logger.log('JwtAuthGuard canActivate called');
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    this.logger.log(`Authorization header (ПОЧЕМУ ТУТ ДРУГОЕ???) ${token}`);
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.error(`JwtAuthGuard handleRequest error (Request from Client): ${err || info.message}`);
      throw err || new UnauthorizedException();
    }
    this.logger.log(`JwtAuthGuard handleRequest user: ${JSON.stringify(user)}`);
    return user;
  }
}
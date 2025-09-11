import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user as { isAdmin?: boolean } | undefined;
    if (!user || !user.isAdmin) {
      throw new UnauthorizedException('Admin access denied');
    }
    return true;
  }
}








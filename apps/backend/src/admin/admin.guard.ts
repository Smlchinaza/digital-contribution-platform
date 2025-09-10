import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user as { email?: string } | undefined;
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!user || !user.email || !adminEmail) {
      throw new UnauthorizedException('Admin access denied');
    }
    if (user.email.toLowerCase() !== adminEmail.toLowerCase()) {
      throw new UnauthorizedException('Admin access denied');
    }
    return true;
  }
}





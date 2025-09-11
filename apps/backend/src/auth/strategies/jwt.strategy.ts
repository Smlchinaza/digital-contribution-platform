import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev_jwt_secret_change_me',
    });
  }

  async validate(payload: any) {
    // Fetch fresh user to ensure current isAdmin flag is enforced
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      return { userId: payload.sub, email: payload.email };
    }
    return { userId: user.id, email: user.email, isAdmin: user.isAdmin };
  }
}



import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_jwt_secret_change_me',
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersService],
  exports: [AuthService],
})
export class AuthModule {}



import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { UsersService } from '../users/users.service';

@Module({
  providers: [GroupsService, UsersService],
  controllers: [GroupsController],
})
export class GroupsModule {}



import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersService } from '../users/users.service';
import { GroupsService } from '../groups/groups.service';

@Module({
  controllers: [AdminController],
  providers: [UsersService, GroupsService],
})
export class AdminModule {}








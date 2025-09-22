import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersService } from '../users/users.service';
import { GroupsModule } from '../groups/groups.module';

@Module({
  controllers: [AdminController],
  providers: [UsersService],
  imports: [GroupsModule],
})
export class AdminModule {}








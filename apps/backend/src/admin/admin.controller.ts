import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { GroupsService } from '../groups/groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  private readonly transactions: any[] = [];

  constructor(
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService,
  ) {}

  @Get('users')
  async users() {
    return this.usersService.all();
  }

  @Get('groups')
  async groups() {
    return this.groupsService.listGroups();
  }

  @Get('groups/:id/next')
  async next(@Param('id') id: string) {
    return this.groupsService.nextPayout(id);
  }

  @Patch('groups/:id/advance')
  async advance(@Param('id') id: string) {
    const group = await this.groupsService.markPayoutComplete(id);
    return group;
  }

  @Get('transactions')
  async transactionsList() {
    return this.transactions;
  }
}





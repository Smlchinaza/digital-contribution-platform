import { Controller, Get, Param, Patch, Post, Delete, UseGuards, Body } from '@nestjs/common';
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

  @Patch('users/:id/promote')
  async promote(@Param('id') id: string) {
    const userId = Number(id);
    const user = await this.usersService.setAdminStatus(userId, true);
    return user;
  }

  @Patch('users/:id/demote')
  async demote(@Param('id') id: string) {
    const userId = Number(id);
    const user = await this.usersService.setAdminStatus(userId, false);
    return user;
  }

  @Patch('users/promote-by-email')
  async promoteByEmail(@Body() body: { email: string }) {
    const user = await this.usersService.setAdminStatusByEmail(body.email, true);
    return user;
  }

  @Patch('users/demote-by-email')
  async demoteByEmail(@Body() body: { email: string }) {
    const user = await this.usersService.setAdminStatusByEmail(body.email, false);
    return user;
  }

  // Group management endpoints
  @Post('groups/:groupId/add-user')
  async addUserToGroup(
    @Param('groupId') groupId: string,
    @Body() body: { userId: string; position?: number }
  ) {
    return this.groupsService.addUserToGroup(groupId, body.userId, body.position);
  }

  @Delete('groups/:groupId/remove-user')
  async removeUserFromGroup(
    @Param('groupId') groupId: string,
    @Body() body: { userId: string }
  ) {
    return this.groupsService.removeUserFromGroup(groupId, body.userId);
  }

  @Patch('groups/:groupId/assign-payout')
  async assignNextPayout(
    @Param('groupId') groupId: string,
    @Body() body: { userId: string }
  ) {
    return this.groupsService.assignNextPayout(groupId, Number(body.userId));
  }

  @Delete('groups/:id')
  async deleteGroup(@Param('id') id: string) {
    return this.groupsService.deleteGroup(id);
  }
}








import { Controller, Get, Param, Patch, Post, Delete, UseGuards, Body, ParseIntPipe } from '@nestjs/common';
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
  async next(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.nextPayout(id);
  }

  @Patch('groups/:id/advance')
  async advance(@Param('id', ParseIntPipe) id: number) {
    const group = await this.groupsService.markPayoutComplete(id);
    return group;
  }

  @Get('transactions')
  async transactionsList() {
    return this.transactions;
  }

  @Patch('users/:id/promote')
  async promote(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.setAdminStatus(id, true);
    return user;
  }

  @Patch('users/:id/demote')
  async demote(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.setAdminStatus(id, false);
    return user;
  }

  @Patch('users/promote-by-email')
  async promoteByEmail(@Body() body: any) {
    const user = await this.usersService.setAdminStatusByEmail(body.email, true);
    return user;
  }

  @Patch('users/demote-by-email')
  async demoteByEmail(@Body() body: any) {
    const user = await this.usersService.setAdminStatusByEmail(body.email, false);
    return user;
  }

  // Group management endpoints
  @Post('groups/:groupId/add-user')
  async addUserToGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() body: { userId: number; position?: number }
  ) {
    return this.groupsService.addUserToGroup(groupId, body.userId, body.position);
  }

  @Delete('groups/:groupId/remove-user')
  async removeUserFromGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() body: { userId: number }
  ) {
    return this.groupsService.removeUserFromGroup(groupId, body.userId);
  }

  @Patch('groups/:groupId/assign-payout')
  async assignNextPayout(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() body: { userId: number }
  ) {
    return this.groupsService.assignNextPayout(groupId, body.userId);
  }

  @Delete('groups/:id')
  async deleteGroup(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.deleteGroup(id);
  }
}








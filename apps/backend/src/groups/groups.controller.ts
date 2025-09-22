import { Body, Controller, Get, Param, Patch, Post, UseGuards, Delete } from '@nestjs/common';
import { GroupsService, ContributionAmount, PlanType } from './groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../admin/admin.guard';
import { CurrentUser } from '../shared/current-user.decorator';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  list() {
    return this.groupsService.listGroups();
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: { title: string; amount: ContributionAmount; plan: PlanType }) {
    return this.groupsService.createGroup(body);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    return this.groupsService.joinGroup(id, user.userId);
  }

  @Get(':id/next-payout')
  next(@Param('id') id: string) {
    return this.groupsService.nextPayout(id);
  }

  @Patch(':id/mark-paid')
  markPaid(@Param('id') id: string) {
    return this.groupsService.markPayoutComplete(id);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  delete(@Param('id') id: string) {
    return this.groupsService.deleteGroup(id);
  }

  @Get('my-groups')
  myGroups(@CurrentUser() user: { userId: string }) {
    return this.groupsService.getUserGroups(user.userId);
  }

  @Get('my-contributions')
  myContributions(@CurrentUser() user: { userId: string }) {
    return this.groupsService.getUserContributions(user.userId);
  }
}



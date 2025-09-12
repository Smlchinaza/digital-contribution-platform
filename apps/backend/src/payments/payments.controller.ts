import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Body, 
  Param, 
  UseGuards,
  ParseIntPipe 
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import type { CreatePaymentDto, UpdatePaymentStatusDto } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../admin/admin.guard';
import { CurrentUser } from '../shared/current-user.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  createPayment(
    @CurrentUser() user: { userId: string },
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.createPayment(parseInt(user.userId), createPaymentDto);
  }

  @Get('my-payments')
  getMyPayments(@CurrentUser() user: { userId: string }) {
    return this.paymentsService.getUserPayments(parseInt(user.userId));
  }

  @Get()
  @UseGuards(AdminGuard)
  getAllPayments() {
    return this.paymentsService.getAllPayments();
  }

  @Get('pending')
  @UseGuards(AdminGuard)
  getPendingPayments() {
    return this.paymentsService.getPendingPayments();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  getPaymentById(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.getPaymentById(id);
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  updatePaymentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    return this.paymentsService.updatePaymentStatus(id, updatePaymentStatusDto);
  }
}


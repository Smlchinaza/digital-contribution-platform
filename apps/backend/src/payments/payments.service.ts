import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Payment, Prisma } from '@prisma/client';

export interface CreatePaymentDto {
  groupId: number;
  amount: number;
  userBankName: string;
  userAccountName: string;
  userAccountNumber: string;
  receiptUrl?: string;
}

export interface UpdatePaymentStatusDto {
  status: 'approved' | 'rejected';
  adminNotes?: string;
}

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPayment(userId: number, data: CreatePaymentDto): Promise<Payment> {
    // Check if user is a member of the group
    const groupMember = await this.prisma.groupMember.findFirst({
      where: {
        userId,
        groupId: data.groupId,
      },
    });

    if (!groupMember) {
      throw new BadRequestException('You are not a member of this group');
    }

    // Check if there's already a pending payment for this user in this group
    const existingPayment = await this.prisma.payment.findFirst({
      where: {
        userId,
        groupId: data.groupId,
        status: 'pending',
      },
    });

    if (existingPayment) {
      throw new BadRequestException('You already have a pending payment for this group');
    }

    return this.prisma.payment.create({
      data: {
        userId,
        groupId: data.groupId,
        amount: data.amount,
        userBankName: data.userBankName,
        userAccountName: data.userAccountName,
        userAccountNumber: data.userAccountNumber,
        receiptUrl: data.receiptUrl,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        group: {
          select: {
            id: true,
            title: true,
            amount: true,
            plan: true,
          },
        },
      },
    });
  }

  async getUserPayments(userId: number): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { userId },
      include: {
        group: {
          select: {
            id: true,
            title: true,
            amount: true,
            plan: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllPayments(): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        group: {
          select: {
            id: true,
            title: true,
            amount: true,
            plan: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPendingPayments(): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { status: 'pending' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        group: {
          select: {
            id: true,
            title: true,
            amount: true,
            plan: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updatePaymentStatus(
    paymentId: number,
    data: UpdatePaymentStatusDto,
  ): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: true,
        group: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'pending') {
      throw new BadRequestException('Payment has already been processed');
    }

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: data.status,
        adminNotes: data.adminNotes,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        group: {
          select: {
            id: true,
            title: true,
            amount: true,
            plan: true,
          },
        },
      },
    });
  }

  async getPaymentById(paymentId: number): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        group: {
          select: {
            id: true,
            title: true,
            amount: true,
            plan: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}


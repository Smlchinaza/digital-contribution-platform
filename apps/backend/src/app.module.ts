import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentsModule } from './payments/payments.module';
import { SermonsModule } from './sermons/sermons.module';

@Module({
  imports: [PrismaModule, AuthModule, GroupsModule, AdminModule, PaymentsModule, SermonsModule]
})
export class AppModule {}

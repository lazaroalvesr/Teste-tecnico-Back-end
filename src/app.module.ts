import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ReadingModule } from './reading/reading.module';
import { CustomerModule } from './customer/customer.module';
import { ConfirmModule } from './confirm/confirm.module';

@Module({
  imports: [PrismaModule, ReadingModule, CustomerModule, ConfirmModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

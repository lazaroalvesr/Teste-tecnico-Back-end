import { Module } from '@nestjs/common';
import { ConfirmController } from './confirm.controller';
import { ConfirmService } from './confirm.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ConfirmController],
  providers: [ConfirmService, PrismaService]
})
export class ConfirmModule {}

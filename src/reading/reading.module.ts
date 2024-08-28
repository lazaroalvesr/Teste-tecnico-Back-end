import { Module } from '@nestjs/common';
import { ReadingController } from './reading.controller';
import { ReadingService } from './reading.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ReadingController],
  providers: [ReadingService, PrismaService]
})
export class ReadingModule {}

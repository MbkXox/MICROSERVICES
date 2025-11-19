import { Module } from '@nestjs/common';
import { GifsService } from './gifs.service';
import { GifsController } from './gifs.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [GifsController],
  providers: [GifsService, PrismaService],
})
export class GifsModule {}
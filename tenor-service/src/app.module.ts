import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GifsModule } from './gifs/gifs.module';
import { PrismaService } from '../prisma/prisma.service';
import { HealthController } from './health.controller';

@Module({
  imports: [ConfigModule.forRoot(), GifsModule],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}

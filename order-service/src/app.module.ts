import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { PrismaService } from 'prisma/prisma.service';
import { HealthController } from './health.controller';

@Module({
  imports: [ConfigModule.forRoot(), OrdersModule],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}

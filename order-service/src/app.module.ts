import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { PrismaService } from 'prisma/prisma.service';
import { HealthController } from './health.controller';

@Module({
  imports: [ConfigModule.forRoot(), OrdersModule],
  controllers: [HealthController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

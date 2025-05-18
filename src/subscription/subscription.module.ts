import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { WeatherService } from 'src/weather/weather.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), MailModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService,WeatherService],
})
export class SubscriptionModule {}

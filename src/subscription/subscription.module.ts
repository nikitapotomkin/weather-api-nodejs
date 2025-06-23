import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { WeatherService } from 'src/weather/weather.service';
import { WeatherModule } from 'src/weather/weather.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), MailModule, WeatherModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}

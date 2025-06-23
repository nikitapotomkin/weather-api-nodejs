import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/subscription/subscription.entity';
import { MailModule } from 'src/mail/mail.module';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getBulkConfig } from 'src/config/bulk.config';
import { WeatherProcessor } from './wether-processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'weather',
      defaultJobOptions: {
        removeOnComplete: 5, 
        removeOnFail: 20,    
      },
      settings: {
        stalledInterval: 30 * 1000, 
        maxStalledCount: 1,
        retryProcessDelay: 5000,
      },
    }),
    TypeOrmModule.forFeature([Subscription]),
    MailModule],
  controllers: [WeatherController],
  providers: [WeatherService,WeatherProcessor],
  exports:[WeatherService]
})
export class WeatherModule {}

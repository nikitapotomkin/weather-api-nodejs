import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherJobData } from './types/weather-job-data';

@Processor('weather')
@Injectable()
export class WeatherProcessor {
  constructor(private readonly weatherService: WeatherService) {}

  @Process({
    concurrency: 5
  })
  async handleWeatherNotification(job: Job<WeatherJobData>) {
    const { city } = job.data;
      
      await this.weatherService.processWeatherJob(job.data);
      
      return {
        city,
        status: 'success',
        processedAt: new Date(),
      };
  }
}
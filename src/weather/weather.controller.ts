import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { SubscriptionFrequency } from 'src/common/utils/db-enums';

@Controller()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('weather')
  async getCurrentWeather(@Query('city') city: string) {
    if (!city) throw new BadRequestException('Invalid request');
    
    return await this.weatherService.getCurrentWeather(city);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionFrequency } from 'src/common/utils/db-enums';
import { MailService } from 'src/mail/mail.service';
import { Subscription } from 'src/subscription/subscription.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WeatherService {
  private apiKey:string;
  constructor(
    private readonly configSerice: ConfigService,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly mailService: MailService,
  ) {
     this.apiKey = this.configSerice.get<string>('API_KEY')!;
  }

  async getCurrentWeather(city: string): Promise<CurrentWeather> {
    const url = `http://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${encodeURIComponent(city)}&aqi=no`;

    const response = await fetch(url);

    if (!response.ok) throw new NotFoundException('City not found');

    const data = await response.json();

    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }
  
  async checkCity(city:string){
    const url = `http://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${encodeURIComponent(city)}&aqi=no`;
    
    const response = await fetch(url);
    
    if (!response.ok) return false;
    
    return true
  }

  private async sendWeatherToSubscribers(frequency: SubscriptionFrequency) {
    const subscribers = await this.subscriptionRepository.find({
      where: {
        frequency,
        isConfirmed: true,
      },
      select:['city','email']
    });

    if (subscribers.length === 0) return;

    await Promise.allSettled(
        subscribers.map(async (sub) => {
        const weather = await this.getCurrentWeather(sub.city);
        await this.mailService.sendCurrentWeatherEmail(weather, sub.email,sub.city);
    })
);

  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourly() {
    await this.sendWeatherToSubscribers(SubscriptionFrequency.HOURLY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDaily() {
    await this.sendWeatherToSubscribers(SubscriptionFrequency.DAILY);
  }
}

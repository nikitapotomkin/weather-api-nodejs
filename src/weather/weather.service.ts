import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Subscription } from 'src/subscription/subscription.entity';
import { SubscriptionFrequency } from 'src/common/utils/db-enums';
import { MailService } from '../mail/mail.service';
import pLimit from 'p-limit';
import { WeatherJobData } from './types/weather-job-data';
import { CurrentWeather } from './types/current-weather.type';


@Injectable()
export class WeatherService {
  private apiKey: string;
  private apiUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly mailService: MailService,
    @InjectQueue('weather')
    private readonly weatherQueue: Queue<WeatherJobData>,
  ) {
    this.apiKey = this.configService.get<string>('API_KEY')!;
    this.apiUrl = 'http://api.weatherapi.com/v1/current.json?key=';
  }

  async getCurrentWeather(city: string): Promise<CurrentWeather> {
    const url = `${this.apiUrl}${this.apiKey}&q=${encodeURIComponent(city)}&aqi=no`;

    const response = await fetch(url);

    if (!response.ok) throw new NotFoundException('City not found');

    const data = await response.json();

    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }

  async checkCity(city: string): Promise<boolean> {
    const url = `${this.apiUrl}${this.apiKey}&q=${encodeURIComponent(city)}&aqi=no`;

    const response = await fetch(url);

    if (!response.ok) return false;

    return true;
  }

  async addSubscribersToQueue(
    subscribers: any[],
    frequency: SubscriptionFrequency,
  ) {
    const jobs = subscribers.map((sub) => ({
      data: {
        city: sub.city,
        email: sub.email,
        frequency: frequency,
      } as WeatherJobData,
    }));

    await this.weatherQueue.addBulk(jobs);
  }

  async sendWeatherToSubscribers(frequency: SubscriptionFrequency) {
    const subscribers = await this.subscriptionRepository.find({
    where: {
      frequency,
      isConfirmed: true,
    },
    select: ['city'],
  
  });

  if (subscribers.length === 0) return;

  const uniqueCities = new Set(subscribers.map(sub => sub.city));

  const jobs = Array.from(uniqueCities).map(city => ({
    data: { city, frequency },
  }));

  await this.weatherQueue.addBulk(jobs);
  }

  async processWeatherJob(jobData: WeatherJobData): Promise<void> {
    const { city, frequency } = jobData;

    const weather = await this.getCurrentWeather(city);

    const subscribers = await this.subscriptionRepository.find({
      where: {
        city,
        frequency,
        isConfirmed: true,
      },
      select: ['email','id']
    });
    
    if (!subscribers.length) return;

    const limit = pLimit(10);
    
    const sendTasks = subscribers.map(async ({ email }) =>{
    return limit(() => this.mailService.sendCurrentWeatherEmail(weather, email, city))
    });

    await Promise.all(sendTasks);
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

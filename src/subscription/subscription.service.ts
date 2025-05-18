import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscribeDto } from './subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './subscription.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { WeatherService } from 'src/weather/weather.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly mailService: MailService,
    private readonly weatherService:WeatherService
  ) {}

  async subscribe(dto: CreateSubscribeDto) {
    const isExist = await this.subscriptionRepository.findOne({
      where: { email: dto.email, isConfirmed: true },
      select: ['id'],
    });

    if (isExist) throw new ConflictException('Email already subscribed');

    const token = Math.random().toString(36).substring(2);

    const isExistCity = await this.weatherService.checkCity(dto.city);
    
    if(!isExistCity) return;
    
    await this.subscriptionRepository.save({ ...dto, token });

    await this.mailService.sendConfirmSubscribeEmail(dto.email, token);

    return { message: 'Subscription successfully. Confirmation email sent.' };
  }

  async confirmSubscription(token: string) {
    const isExist = await this.subscriptionRepository.findOne({
      where: { token },
      select: ['id'],
    });

    if (!isExist) throw new NotFoundException('Token not found');

    await this.subscriptionRepository.update({ token }, { isConfirmed: true });

    return { message: 'Subscription confirmed successfully' };
  }

  async unsubscribe(token: string) {
    const isExist = await this.subscriptionRepository.findOne({
      where: { token },
      select: ['id'],
    });

    if (!isExist) throw new NotFoundException('Token not found');

    await this.subscriptionRepository.delete({ token });

    return { message: 'Unsubscribed successfully' };
  }
}

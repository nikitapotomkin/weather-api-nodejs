import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscribeDto } from './subscription.dto';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  async subscribe(@Body() dto: CreateSubscribeDto) {
    return await this.subscriptionService.subscribe(dto);
  }

  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token') token: string) {
    return await this.subscriptionService.unsubscribe(token);
  }

  @Get('confirm/:token')
  async confirmSubscription(@Param('token') token: string) {
    return await this.subscriptionService.confirmSubscription(token);
  }
}

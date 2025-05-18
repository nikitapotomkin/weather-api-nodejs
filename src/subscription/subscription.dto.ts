import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { SubscriptionFrequency } from '../common/utils/db-enums';

export class CreateSubscribeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsIn([SubscriptionFrequency.HOURLY, SubscriptionFrequency.DAILY])
  frequency: string;
}

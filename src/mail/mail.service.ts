import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { ConfirmSubscribeTemplate } from './templates/confirm-subscribe.template';
import { CurrentWeatherTemplate } from './templates/current-weather.template';

@Injectable()
export class MailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendConfirmSubscribeEmail(email: string, token: string) {
    const html = await render(ConfirmSubscribeTemplate(token));

    return this.sendMail(email, 'Email confirmation', html);
  }

  async sendCurrentWeatherEmail(weather: CurrentWeather, email: string,city:string) {
    const html = await render(CurrentWeatherTemplate(weather));

    return this.sendMail(email, `Current weather in ${city}`, html);
  }

  private sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }
}

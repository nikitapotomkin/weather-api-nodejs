import { SubscriptionFrequency } from "src/common/utils/db-enums";

export type WeatherJobData = {
  city: string;
  frequency: SubscriptionFrequency;
}
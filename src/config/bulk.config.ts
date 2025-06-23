import { BullModule } from "@nestjs/bull";
import { DynamicModule } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export const getBulkConfig = async ( configService: ConfigService) => {
 return {
      redis: {
        host: configService.getOrThrow<string>('REDIS_HOST'),
        port: +configService.getOrThrow<number>('REDIS_PORT'),
      },
    }
}
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from "@nestjs/typeorm";
import { Merchant } from "./seller/entities/seller.entity";
import { SellerRepresentative } from "./seller/entities/seller-representative.entity";
import { DiscountPrice } from "./price/entities/price-discount.entity";
import { Price } from "./price/entities/price.entity";
import { Offer } from "./offer/entities/offer.entity";
import { EventTracker } from "./tracker/entities/event-tracker.entity";



export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: "postgres",
      host: configService.get("DB_HOST", "database"),
      port: parseInt(configService.get("DB_PORT", "5432")),
      username: configService.get("DB_USERNAME", "postgres"),
      password: configService.get("DB_PASSWORD", "vardast@1234"),
      database: configService.get("DB_NAME", "v2"),
      synchronize: configService.get("DB_SYNC", "true") === "true",
      logging: configService.get("DB_QUERY_LOG", "true") === "true",
      entities: [
        Merchant,
        SellerRepresentative,
        DiscountPrice,
        Price,
        Offer,
        EventTracker
      ],
    };
  },
};

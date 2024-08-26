import { Module } from "@nestjs/common";
import { CompressionService } from "src/compression.service";
import { DecompressionService } from "src/decompression.service";
import { OfferController } from "./offer.controller";

@Module({
  controllers: [OfferController],
  providers: [CompressionService, DecompressionService],
})
export class OfferModule {}

import { Module } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';

@Module({
    controllers: [SellerController],
    providers: [CompressionService, DecompressionService],
})
export class SellerModule {}

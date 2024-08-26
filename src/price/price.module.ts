import { Module } from '@nestjs/common';
import { PriceController } from './price.controller';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';

@Module({
    controllers: [PriceController],
    providers: [CompressionService, DecompressionService],
})
export class PriceModule {}

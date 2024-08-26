import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';
@Module({
  providers: [
    CronService,
    CompressionService,
    DecompressionService,
  ]
})
export class CronModule {}

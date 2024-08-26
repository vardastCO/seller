import { Module } from '@nestjs/common';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';
import { TrackerController } from './tracker.controller';
@Module({
  controllers: [TrackerController],
  providers: [
    CompressionService,
    DecompressionService,
  ]
})
export class TrackerModule {}

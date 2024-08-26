import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';
import { EventTracker } from './entities/event-tracker.entity';

@Controller()
export class TrackerController {
  constructor(private readonly compressionService: CompressionService,
    private readonly decompressionService: DecompressionService 
    ) {}

  @MessagePattern({ cmd: 'create_event_tracker' })
  async create_event_tracker(@Payload() data: any, @Ctx() context: any)  {
    const input = this.decompressionService.decompressData(data.data).event;

    try {
      const event        = new EventTracker()
      event.agent        = input.agent
      event.type         = input.type
      event.ipAddress    = input.ipAddress
      event.userId       = input.userId
      event.subjectId    = input.subjectId
      event.subjectType  = input.subjectType
      event.url          = input.url
      try {
        await event.save();
        return true
      } catch (e) {
        return false
      }

    }catch(e){
      throw new Error('seller with the same name or name_en already exists');
      
    }

    
  }



}

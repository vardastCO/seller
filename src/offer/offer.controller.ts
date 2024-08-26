import { Controller, NotFoundException } from '@nestjs/common';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { Offer } from './entities/offer.entity';
import { SortFieldOffer } from './enums/sort-filed-offer.enum';
@Controller()
export class OfferController {
  constructor(private readonly compressionService: CompressionService,
    private readonly decompressionService: DecompressionService 
    ) {}
    @MessagePattern({ cmd: 'getOffers' })
    async getOffers(@Payload() data: any, @Ctx() context: any)  {
      try {
        const input = this.decompressionService.decompressData(data.data);

        const { take, skip ,productId,sortDirection,sortField } =
        input.indexPublicofferInput || {};
        const order: any = {}    
        switch (sortField) {
          case SortFieldOffer.TIME:
            order['last_price_date'] = sortDirection;
            break;
          case SortFieldOffer.PRICE:
            order['last_price'] = sortDirection;
            break;
        }
        const offers = await Offer.findAndCount({
          take:take,
          skip:skip,
          where: {
            productId: productId
          },
          order:order,
          relations: ["seller"],

        });
        const jsonString = JSON.stringify(offers).replace(/__seller__/g, 'seller');

        const modifiedDataWithOutText = JSON.parse(jsonString);

        return this.compressionService.compressData(modifiedDataWithOutText)
        
  
      } catch(e) {
        console.log('eeeeeeeee',e)
        throw new Error('i cant create_offer seller ');
      }
      
    }

    @MessagePattern({ cmd: 'get_total_offers' })
    async get_total_offers(@Payload() data: any, @Ctx() context: any)  {
      try {
        const input = this.decompressionService.decompressData(data.data);

        const { take, skip, productId,sellerId, isPublic, isAvailable, status } =
        input.indexOfferInput || {};
        const offers = await Offer.findAndCount({
          take:take,
          skip:skip,
          where: { sellerId, productId, isPublic, status },
          order: { id: "DESC" },
          relations: ["seller"],
        });
        const jsonString = JSON.stringify(offers).replace(/__seller__/g, 'seller');

        const modifiedDataWithOutText = JSON.parse(jsonString);

        return this.compressionService.compressData(modifiedDataWithOutText)
        
  
      } catch(e) {
        console.log('eeeeeeeee',e)
        throw new Error('i cant get_total_offers ');
      }
      
    }

    @MessagePattern({ cmd: 'get_single_offer' })
    async get_single_offer(@Payload() data: any, @Ctx() context: any)  {
      try {
        const input = this.decompressionService.decompressData(data.data);

        const offer: Offer = await  Offer.findOne({
          where: {
              id: input.id,
          },
          relations: ["seller"],
        });
    
        const jsonString = JSON.stringify(offer).replace(/__seller__/g, 'seller');

        const modifiedDataWithOutText = JSON.parse(jsonString);

        return this.compressionService.compressData(modifiedDataWithOutText)
        
  
      } catch(e) {
        console.log('eeeeeeeee',e)
        throw new Error('i cant get_single_offer ');
      }
      
    }

    @MessagePattern({ cmd: 'create_offer' })
    async find_seller(@Payload() data: any, @Ctx() context: any)  {
      const input = this.decompressionService.decompressData(data.data);
      try {

        const existingOffer = await Offer.findOne({
          where: [
              { sellerId: input.sellerId,
                productId : input.createOfferInput.productId
              }
          ]
        });
    
        if (existingOffer) {
            return false
        }
        const offer = new Offer();

        offer.productId    = input.createOfferInput.productId;
        offer.sellerId     = input.sellerId
        offer.isPublic     = input.createOfferInput.isPublic ?? true
     
        await offer.save();

        return this.compressionService.compressData(offer)
        
  
      } catch(e) {

        throw new Error('i cant create_offer seller ');
      }
      
    }
    @MessagePattern({ cmd: 'remove_offer' })
    async remove_offer(@Payload() data: any, @Ctx() context: any)  {
      const input = this.decompressionService.decompressData(data.data);
      try {

        const existingOffer = await Offer.findOne({
          where: [
              { id: input.offerId}
          ]
        });
        if (existingOffer == null) {
            return false
        }
         
        await existingOffer.remove();

        return true
        
  
      } catch(e) {
        return false
      }
      
    }
    async getOfferWithFilter(query){
  
    }

    @MessagePattern({ cmd: 'my_offer' })
    async my_offer(@Payload() data: any, @Ctx() context: any)  {
      const input = this.decompressionService.decompressData(data.data);
      try {
        if(input.query){
          return this.getOfferWithFilter(input.query)
        }
        const [result, total] = await Offer.findAndCount({
          take:input.indexMyofferInput.take,
          skip:input.indexMyofferInput.skip,
          where: {
            sellerId : input.sellerId
          },
          order: {
            last_price_date:'DESC'
          
          },
        });

        return this.compressionService.compressData([result,total])
        
  
      } catch(e) {
        console.log('my_offer seller service',e)
        throw new Error('i cant create_offer seller ');
      }
      
    }
}

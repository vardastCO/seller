import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';
import { Merchant } from './entities/seller.entity';
import { SellerRepresentative } from './entities/seller-representative.entity';
import { SellerRepresentativeRoles } from './enums/seller-representative-roles.enum';
import { SortSellerEnum } from './enums/sortSellerEnum';
import { ShortResponse } from 'src/base/enums/short-response';
import { Like,In } from "typeorm";
import { DataSource, IsNull } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
@Controller()
export class SellerController {
  constructor(private readonly compressionService: CompressionService,
    private readonly decompressionService: DecompressionService ,
    @InjectDataSource() private readonly dataSource: DataSource
    ) {}

  @MessagePattern({ cmd: 'create_seller' })
  async cretateSeller(@Payload() data: any, @Ctx() context: any)  {
    const becomeASellerInput = this.decompressionService.decompressData(data.data);
    try {
      const existingBrand = await SellerRepresentative.findOne({
        where: [
            { userId: becomeASellerInput.userId }
        ]
      });
  
      if (existingBrand) {
          throw new Error('seller with the same name or name_en already exists');
      }
      const seller = new Merchant();

      seller.name = becomeASellerInput.becomeASellerInput.name;
      seller.bio  = becomeASellerInput.becomeASellerInput.bio;
      seller.createdById = becomeASellerInput.userId
      await seller.save();

      const rep =  new SellerRepresentative()
      rep.sellerId = seller.id
      rep.userId   =  becomeASellerInput.userId
      rep.isActive   =  false
      rep.createdById   =  becomeASellerInput.userId

      await rep.save();

      return seller;

    }catch(e){
      throw new Error('seller with the same name or name_en already exists');
      
    }

    
  }

  @MessagePattern({ cmd: 'update_seller' })
  async update_seller(@Payload() data: any, @Ctx() context: any)  {
    const input = this.decompressionService.decompressData(data.data);
    try {
      const seller: Merchant = await Merchant.findOneBy({ id: input.updateSellerInput.id });
      if (!seller) {
        return false;
      }

      Object.assign(seller, input.updateSellerInput);
      
      await seller.save();

      return this.compressionService.compressData(seller);

    }catch(e){
      console.log('yyyyyyyyyy',e)
      throw new Error('seller with the same name or name_en already exists');
      
    }

    
  }
  @MessagePattern({ cmd: 'find_seller' })
  async find_seller(@Payload() data: any, @Ctx() context: any)  {
    const userId = this.decompressionService.decompressData(data.data).userId;
    try {
      const seller = await SellerRepresentative.findOne({
        where: [
            { userId }
        ]
      });

      return seller;

    }catch(e){
      throw new Error('i cant find seller ');
      
    }

    
  }
  @MessagePattern({ cmd: 'pagination_sellers' })
  async pagination_sellers(@Payload() data: any, @Ctx() context: any)  {
    const input = this.decompressionService.decompressData(data.data);

    if ( input.indexSellerInput.brandId){
      return this.getPaginationSellerFilterBrand(input)
    }
    const order: any = {}
    const { sortField, sortDirection } = input.indexSellerInput;
    switch (sortField) {
      case SortSellerEnum.CREATED:
        order['createdAt'] = sortDirection;
        break;
      case SortSellerEnum.RATING:
        order['rating'] = sortDirection;
        break;
      case SortSellerEnum.STATUS:
        order['status'] = sortDirection;
        break;
      case SortSellerEnum.PRODUCT:
          order['sum'] = sortDirection;
          break;
    }
    try {
      const whereConditions: any = {};
    
      if (input.indexSellerInput.name) {
        whereConditions[`name`] = Like(`%${input.indexSellerInput.name}%`);
      }
      const [result, total]  = await Merchant.findAndCount({
        take:input.indexSellerInput.take,
        skip:input.indexSellerInput.skip,
        where: whereConditions,
        order: order,
      });

      const compressedResponse = this.compressionService.compressData([result,total]);
      return compressedResponse;

    }catch(e){
      throw new Error('i cant find seller ');
      
    }

    
  }

  async getPaginationSellerFilterBrand(data:any)  {
    try {
      const skip = data.indexSellerInput.skip
      const take = data.indexSellerInput.take
    
      const brandId = data.indexSellerInput.brandId;

      const sqlQuery = `
             
      SELECT DISTINCT po."sellerId"
      FROM product_offers po 
      JOIN products p ON po."productId" = p."id"
      JOIN parent_product ON p."parentId" = parent_product.id 
      WHERE parent_product."brandId" = ${brandId}
      LIMIT ${take}
      OFFSET ${skip};
      
 
      `;
      const selleIdsResult = await this.dataSource.query(sqlQuery)

      const sellerIds = selleIdsResult.map(row => row.sellerId);

      const [response, total] = await Merchant.findAndCount({
          where: {
              id: In(sellerIds),
              deletedAt : IsNull()
          }
      });

      const compressedResponse = this.compressionService.compressData([response,total]);

      return compressedResponse;
  } catch (error) {
      // Handle error
      console.error("Error in getPaginationSellerFilterBrand:", error);
  }


  }
  @MessagePattern({ cmd: 'my_short_data_seller_brands' })
  async my_short_data_seller_brands(@Payload() data: any, @Ctx() context: any)  {
    return 0 
  }

  @MessagePattern({ cmd: 'my_short_data_seller_products' })
  async my_short_data_seller_products(@Payload() data: any, @Ctx() context: any)  {
    return 0 
  }

  @MessagePattern({ cmd: 'my_short_data_seller_categories' })
  async my_short_data_seller_categories(@Payload() data: any, @Ctx() context: any)  {
    return 0 
  }

  @MessagePattern({ cmd: 'my_short_data_seller_views' })
  async my_short_data_seller_views(@Payload() data: any, @Ctx() context: any)  {
    return 0 
  }

  @MessagePattern({ cmd: 'search_sellers' })
    async search_sellers(@Payload() data: any, @Ctx() context: any)  {
  
      const input = (this.decompressionService.decompressData(data.data));
  
      const whereConditions: any = {};
    
      if (input.query.query) {
        whereConditions[`name`] = Like(`%${input.query.query}%`);
      }
      
      const  result  =  await Merchant.find({
        take :  ShortResponse.SHORT,
        where: whereConditions,
      });
   
      const compressedResponse = this.compressionService.compressData(result);
  
  
      return compressedResponse;
  }
  @MessagePattern({ cmd: 'find_one_seller' })
  async find_one_seller(@Payload() data: any, @Ctx() context: any)  {

    const input = (this.decompressionService.decompressData(data.data));

    
    const  result  =  await Merchant.findOneBy({
       id: input.id
    });
 
    const compressedResponse = this.compressionService.compressData(result);


    return compressedResponse;
  }

  @MessagePattern({ cmd: 'find_sellers_by_ids' })
  async find_sellers_by_ids(@Payload() data: any, @Ctx() context: any)  {

    const input = (this.decompressionService.decompressData(data.data));

    
    const  result : Merchant[]  =  await Merchant.findBy({
      id: In(input.ids),
    });
 
    const compressedResponse = this.compressionService.compressData(result);
  

    return compressedResponse;
  }


}

import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Price } from './entities/price.entity';
import { Offer } from 'src/offer/entities/offer.entity';
import { DiscountPrice } from './entities/price-discount.entity';
@Controller()
export class PriceController {
  constructor(private readonly compressionService: CompressionService,
    private readonly decompressionService: DecompressionService ,
    @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

  @MessagePattern({ cmd: 'getNewPriceFromIds' })
  async getNewPriceFromIds(@Payload() data: any, @Ctx() context: any)  {
    const productIds: number[] = data.productIds;

  
    const productIdString = productIds.join(',');
    const query = `
    SELECT p."productId",p."isExpired", p.amount , p."createdAt",d.calculated_price AS amountwithdiscount,d.value As percentdiscount,d.orginal_price As orginal
      FROM product_prices p
      LEFT JOIN 
      product_prices_discount d ON p.id = d."priceId"
      WHERE (p."productId", p."createdAt") IN (
        SELECT "productId", MAX("createdAt") AS max_created_at
        FROM product_prices
        WHERE "productId" = ANY(array[${productIdString}])
        GROUP BY "productId"
      )
      AND p."productId" = ANY(array[${productIdString}])
    `
    
    const response =  await this.dataSource.query(query);

    const compressedResponse = this.compressionService.compressData(response);

    return compressedResponse;

    
  }

  @MessagePattern({ cmd: 'getLowestPricesFromIds' })
  async getLowestPricesFromIds(@Payload() data: any, @Ctx() context: any)  {
    const productIds: number[] = data.productIds;

  
    const productIdString = productIds.join(',');

    const query = `
    SELECT p."productId",p."isExpired", p.amount , p."createdAt",d.calculated_price AS amountwithdiscount,d.value As percentdiscount,d.orginal_price As orginal
    FROM product_prices p
    LEFT JOIN 
      product_prices_discount d ON p.id = d."priceId"
      WHERE (p."productId", p.amount) IN (
        SELECT "productId", MIN(amount) AS min_amount
        FROM product_prices
        WHERE "productId" = ANY(array[${productIdString}])
        GROUP BY "productId"
      )
      AND p."productId" = ANY(array[${productIdString}])
    `;
    
    const response =  await this.dataSource.query(query);

    const compressedResponse = this.compressionService.compressData(response);

    return compressedResponse;

    
  }

  @MessagePattern({ cmd: 'getPriceData' })
  async getPricesFromId(@Payload() data: any, @Ctx() context: any)  {
    const input = this.decompressionService.decompressData(data.data);


    const query = `
      SELECT 
      p."productId", 
      p.amount ,
      p."isExpired",
      p."createdAt",
      d."orginal_price" ,
      d."value",
      d."type",
      d."calculated_price"
      FROM product_prices p
      LEFT JOIN 
      product_prices_discount d ON p.id = d."priceId"
      WHERE p.id = ${input.id} 
    `;
    
    const response =  await this.dataSource.query(query);

    const compressedResponse = this.compressionService.compressData(response);

    return compressedResponse;

    
  }

  @MessagePattern({ cmd: 'getHighestPricesFromIds' })
  async getHighestPricesFromIds(@Payload() data: any, @Ctx() context: any)  {
    const productIds: number[] = data.productIds;

  
    const productIdString = productIds.join(',');
    const query = `
    SELECT p."productId",p."isExpired", p.amount , p."createdAt",d.calculated_price AS amountwithdiscount,d.value As percentdiscount,d.orginal_price As orginal
      FROM product_prices p
      LEFT JOIN 
      product_prices_discount d ON p.id = d."priceId"
      WHERE (p."productId", p.amount) IN (
        SELECT "productId", Max(amount) AS max_amount
        FROM product_prices
        WHERE "productId" = ANY(array[${productIdString}])
        GROUP BY "productId"
      )
      AND p."productId" = ANY(array[${productIdString}])
    `;
    
    const response =  await this.dataSource.query(query);


    const compressedResponse = this.compressionService.compressData(response);

    return compressedResponse;

    
  }

  @MessagePattern({ cmd: 'add_price' })
  async add_price(@Payload() data: any, @Ctx() context: any)  {
    try{
      const input = this.decompressionService.decompressData(data.data);

      const existingOffer = await Offer.findOne({
        where: [
            { sellerId: input.sellerId,
              productId : input.createPriceInput.productId
            }
        ]
      });
      if (existingOffer == null) {
        return false;
      }
    
      const price = new Price()
      price.amount = input.createPriceInput.amount
      price.inventory = input.createPriceInput.inventory ?? null
      price.productId = input.createPriceInput.productId
      price.sellerId = input.sellerId
      price.createdById = input.userId
      price.isPublic = input.createPriceInput.isPublic
      
    
      await  price.save();
      existingOffer.last_price_id = price.id
      existingOffer.last_price = input.createPriceInput.amount
      existingOffer.total_inventory = input.createPriceInput.inventory ?? null
     
      await existingOffer.save();
      if (input.createPriceInput.valueDiscount && Number(input.createPriceInput.valueDiscount) > 0) {
        const discount = DiscountPrice.create()
        discount.priceId = price.id
        discount.id = price.id
        discount.orginal_price = input.createPriceInput.orginal_price ?? null
        discount.value = input.createPriceInput.valueDiscount
        discount.type = input.createPriceInput.typeDiscount;
       
        discount.calculated_price =
          input.createPriceInput.amount.toString();
        await discount.save();
  
        
      }
    
      return true;
    }catch(e){
      console.log('add price',e)
      return false
    }
    

  }

}

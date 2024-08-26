import { Injectable } from '@nestjs/common';
import { Cron ,CronExpression } from '@nestjs/schedule'
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class CronService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource)
     { }


     @Cron(CronExpression.EVERY_DAY_AT_4AM)
     async updateProductRating(): Promise<void> {
         try {
             let offset = 0;
             const batchSize = 100;
             let totalCount = 0;
 
             const totalCountQuery = `SELECT COUNT(*) AS total_count FROM product_sellers;`;
             const totalCountResult = await this.dataSource.query(totalCountQuery);
             totalCount = parseInt(totalCountResult[0].total_count);
 
             while (offset < totalCount) {
                 const sql = `
                     UPDATE product_sellers 
                     SET sum = (
                         SELECT COUNT(*)
                         FROM product_offers 
                         WHERE product_offers."sellerId" = product_sellers."id"
                     )
                     LIMIT ${batchSize}
                     OFFSET ${offset};
                 `;
                 
                 await this.dataSource.query(sql);
 
                 offset += batchSize;
                 await new Promise(resolve => setTimeout(resolve, 1000));
             }
 
             console.log('Product ratings updated successfully.');
         } catch (error) {
             console.error('Error updating product ratings:', error);
         }
    }

    @Cron(CronExpression.EVERY_DAY_AT_6AM )
    async updateLastPrice(): Promise<void> {
        try {
            let offset = 0;
            const batchSize = 100;
            let totalCount = 0;
    
            const totalCountQuery = `SELECT COUNT(*) AS total_count FROM product_offers;`;
            const totalCountResult = await this.dataSource.query(totalCountQuery);
            totalCount = parseInt(totalCountResult[0].total_count);
    
            while (offset < totalCount) {
                const sql = `
                UPDATE product_offers AS po
                SET 
                    last_price_id = pp.id,
                    last_price = pp.amount,
                    last_price_date = TO_CHAR(pp."createdAt", 'YYYY-MM-DD HH24:MI:SS') 
                FROM product_prices AS pp
                WHERE 
                    pp."productId" = po."productId" 
                    AND pp."sellerId" = po."sellerId"
                    AND pp."id" = (
                        SELECT MAX("id")
                        FROM product_prices
                        WHERE "productId" = pp."productId" 
                        AND "sellerId" = pp."sellerId"
                    )
                    AND po.id IN (
                        SELECT id
                        FROM product_offers
                        LIMIT ${batchSize}
                        OFFSET ${offset}
                    );
                

                `;
                
                await this.dataSource.query(sql);
    
                offset += batchSize;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
    
            console.log('Product ratings updated successfully.');
        } catch (error) {
            console.error('Error updating product ratings:', error);
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_11PM  )
    async updateExpireTime(): Promise<void> {
        try {
            
            const sql = `
            UPDATE product_prices AS po
            SET "isExpired" = true
            WHERE "isExpired" = false
            AND "createdAt" < NOW() - INTERVAL '1 month'';
            
            `;
            
            await this.dataSource.query(sql);
    
    
    
            console.log('Product update Expire Time successfully.');
        } catch (error) {
            console.error('Error update Expire Time :', error);
        }
    }
    

    
}

import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  Index,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PriceTypesEnum } from "../enums/price-types.enum";
import { DiscountPrice } from "./price-discount.entity";
import { Merchant } from "src/seller/entities/seller.entity";
import { MessageEnum } from "../enums/message.enum";

@ObjectType()
@Entity("product_prices")
export class Price extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: "product_prices_id" })
  id: number;

  @Field(() => Int)
  @Index()
  @Column()
  productId: number;

  @Field(() => PriceTypesEnum)
  @Column("enum", { enum: PriceTypesEnum , default : PriceTypesEnum.CONSUMER})
  type: PriceTypesEnum;

  @Field(() => Int)
  @Column()
  @Index()
  amount: number;

  @Field(() => Merchant)
  @ManyToOne(() => Merchant, seller => seller.prices)
  seller: Promise<Merchant>;
  @Index()
  @Column()
  sellerId: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  attributeValueId: number;


  @Field(() => [MessageEnum], { nullable: "items" })
  @Column({
    type: 'enum',
    enum: MessageEnum,
    default: MessageEnum.NOT_EXPIRED 
  })
  message: MessageEnum;


  @Field(() => [DiscountPrice], { nullable: true })
  @OneToMany(() => DiscountPrice, discountPrice => discountPrice.price)
  discount?: Promise<DiscountPrice[]>;

  @Field()
  @Column()
  isPublic: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  inventory: string; 

  @Field(() => Int)
  @Column()
  createdById: number;


  @Field({ nullable: true })
  @Column({ nullable: true })
  @Index()
  deleted_date: string; 

  @Field()
  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column({ default: false })
  @Index()
  isExpired: boolean;

  @Field()
  @Column({ nullable: true })
  deletedAt: Date; 

}

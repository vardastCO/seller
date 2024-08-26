import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ThreeStateSupervisionStatuses } from "../enums/threeStateSupervisionStatuses";
import { Merchant } from "src/seller/entities/seller.entity";
import { Price } from "src/price/entities/price.entity";

@ObjectType()
@Entity("product_offers")
@Index(["productId", "sellerId"], { unique: true }) 
export class Offer extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Merchant)
  @ManyToOne(() => Merchant,{ eager: true })
  seller: Promise<Merchant>;
  @Index()
  @Column()
  sellerId: number;

  @Index()
  @Column()
  productId: number;


  @Field(() => ThreeStateSupervisionStatuses)
  @Column("enum", {
    enum: ThreeStateSupervisionStatuses,
    default: ThreeStateSupervisionStatuses.CONFIRMED,
  })
  status: ThreeStateSupervisionStatuses;


  @Field({ nullable: true })
  @Column({ default: true })
  isPublic: boolean = true;


  @Field({ nullable: true })
  @Column({ nullable: true })
  total_inventory?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  createdAt: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  updatedAt: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  deletedAt: string; 

  
  @Field( { nullable: true })
  @Column({ nullable: true })
  last_price_date: string;

  @Field( { nullable: true })
  @Column({ nullable: true })
  last_price_id: number;

  @Field( { nullable: true })
  @Column({ nullable: true })
  last_price: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  url?: string;
}

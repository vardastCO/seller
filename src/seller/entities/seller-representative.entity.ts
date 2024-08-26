import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index
} from "typeorm";
import { Merchant } from "./seller.entity";

@ObjectType()
@Entity("product_seller_representatives")
@Index(["userId", "sellerId"], { unique: true }) 
export class SellerRepresentative extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Merchant)
  @ManyToOne(() => Merchant, seller => seller.representatives)
  seller: Promise<Merchant>;
  @Index()
  @Column()
  sellerId: number;

  @Field(() => Int)
  @Index()
  @Column()
  userId: number;


  @Field()
  @Column("boolean", { default: false })
  isActive: boolean;

  @Field(() => Int)
  @Column()
  createdById: number;

  @Field()
  @CreateDateColumn()
  createdAt: string;

  @Field()
  @UpdateDateColumn()
  updatedAt: string;
}

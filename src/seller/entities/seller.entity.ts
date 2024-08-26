import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { SellerRepresentative } from "./seller-representative.entity";
import { ThreeStateSupervisionStatuses } from "src/offer/enums/threeStateSupervisionStatuses";
import { Price } from "src/price/entities/price.entity";
import { Offer } from "src/offer/entities/offer.entity";


@ObjectType()
@Entity("product_sellers")
export class Merchant extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;


  @Field(() => Int, { nullable:true ,defaultValue: 1 })
  @Column( {nullable: true } )
  sum : number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  bio?: string;


  @Field(() => Int, { nullable: true })
  @Column( {nullable: true })
  rating?: number= 4;

  @Field(() => ThreeStateSupervisionStatuses)
  @Column("enum", {
    enum: ThreeStateSupervisionStatuses,
    default: ThreeStateSupervisionStatuses.CONFIRMED,
  })
  status: ThreeStateSupervisionStatuses;

  @Field(() => Boolean)
  @Column("boolean", { default: true })
  isPublic: boolean;

  @Field(() => Int, { nullable: true })
  @Column( {nullable: true })
  brandsCount?: number = 0;
  
  @Field(() => Int, { nullable: true })
  @Column( {nullable: true })
  categoriesCount?: number= 0;

  @Field(() => Boolean)
  @Column("boolean", { default: false })
  isBlueTik: boolean;

  @Field(() => Int)
  @Column()
  createdById: number;

  @Field(() => Int, { nullable: true })
  @Column( {nullable: true })
  views?: number = 0;

  @Field()
  @CreateDateColumn()
  createdAt: string;

  @Field()
  @UpdateDateColumn()
  updatedAt: string;

  @Field(() => [Price], { nullable: "items" })
  @OneToMany(() => Price, price => price.seller)
  prices: Promise<Price[]>;

  @Field(() => [Offer], { nullable: "items" })
  @OneToMany(() => Offer, offer => offer.seller)
  offers: Promise<Offer[]>;;


  @Field(() => [SellerRepresentative])
  @OneToMany(
    () => SellerRepresentative,
    representative => representative.seller,
  )
  representatives: Promise<SellerRepresentative[]>;

  @Field()
  @Column({ nullable: true })
  deletedAt: string;
  

}

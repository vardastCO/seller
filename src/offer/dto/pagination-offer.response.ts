import { Field, ObjectType } from "@nestjs/graphql";
import { Offer } from "../entities/offer.entity";
import { PaginationResponse } from "src/base/dto/pagination.response";

@ObjectType()
export class PaginationOfferResponse extends PaginationResponse {
  @Field(() => [Offer], { nullable: "items" })
  data: Offer[];
}

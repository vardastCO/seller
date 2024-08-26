import { registerEnumType } from "@nestjs/graphql";

export enum SortSellerEnum {
  RATING = 'rating',
  CREATED = 'createdAt',
  PRODUCT = 'sum',
  STATUS = 'status',
}

registerEnumType(SortSellerEnum, { name: "SortSellerEnum" });

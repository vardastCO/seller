import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsEnum, IsInt, IsOptional } from "class-validator";
import { ThreeStateSupervisionStatuses } from "../enums/threeStateSupervisionStatuses";
import { IndexInput } from "src/base/dto/index.input";

@InputType()
export class IndexOfferInput extends IndexInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  sellerId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  productId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @Field(() => ThreeStateSupervisionStatuses, { nullable: true })
  @IsOptional()
  @IsEnum(ThreeStateSupervisionStatuses)
  status?: ThreeStateSupervisionStatuses;
}

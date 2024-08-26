import { InputType } from "@nestjs/graphql";
import { PaginationInput } from "./pagination.input";


@InputType()
export class IndexInput extends PaginationInput {}

import {ArgsType, Field, Int} from '@nestjs/graphql';

@ArgsType()
export class BookSeriesOfArgs {
  @Field(() => Int, {nullable: true})
  skip?: number;

  @Field(() => Int, {nullable: true})
  limit?: number;
}

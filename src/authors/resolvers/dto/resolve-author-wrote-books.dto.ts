import {ArgsType, Field, ID, InputType, Int, ObjectType} from '@nestjs/graphql';
import {OrderBy} from '../../../common/order-by.enum';
import {WritingEntity} from '../../entities/writing.entity';

@InputType()
export class AuthorWroteBooksArgsOrderBy {
  @Field(() => OrderBy, {nullable: true, defaultValue: OrderBy.ASC})
  title!: OrderBy;
}

@ArgsType()
export class AuthorWroteBooksArgs {
  @Field(() => Int, {nullable: true, defaultValue: 0})
  skip!: number;

  @Field(() => Int, {nullable: true, defaultValue: 0})
  limit!: number;

  @Field(() => [ID!], {nullable: true, defaultValue: []})
  except!: string[];

  @Field(() => AuthorWroteBooksArgsOrderBy, {
    nullable: true,
    defaultValue: new AuthorWroteBooksArgsOrderBy(),
  })
  orderBy!: AuthorWroteBooksArgsOrderBy;
}

@ObjectType()
export class AuthorWroteBooksReturnType {
  @Field(() => [WritingEntity])
  nodes!: WritingEntity[];

  @Field(() => Int)
  count!: number;

  @Field(() => Boolean)
  hasPrevious!: boolean;

  @Field(() => Boolean)
  hasNext!: boolean;
}

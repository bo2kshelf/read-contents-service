import {Args, Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {BookEntity} from '../../books/entities/book.entity';
import {SeriesPartEntity} from '../entities/series-part.entity';
import {SeriesService} from '../services/series.service';
import {
  ResolveBooksNextArgs,
  ResolveBooksNextReturn,
} from './dto/resolve-books-next.dto';
import {
  ResolveBooksPreviousArgs,
  ResolveBooksPreviousReturn,
} from './dto/resolve-books-previous.dto';

@Resolver(() => BookEntity)
export class BooksResolver {
  constructor(private readonly seriesService: SeriesService) {}

  @ResolveField(() => [SeriesPartEntity])
  async seriesOf(
    @Parent() {id: bookId}: BookEntity,
  ): Promise<SeriesPartEntity[]> {
    return this.seriesService.getSeriesFromBook(bookId);
  }

  @ResolveField(() => ResolveBooksPreviousReturn)
  async previousBooks(
    @Parent() {id: bookId}: BookEntity,
    @Args({type: () => ResolveBooksPreviousArgs})
    args: ResolveBooksPreviousArgs,
  ): Promise<ResolveBooksPreviousReturn> {
    return this.seriesService.previousBooks(bookId, args);
  }

  @ResolveField(() => ResolveBooksNextReturn)
  async nextBooks(
    @Parent() {id: bookId}: BookEntity,
    @Args({type: () => ResolveBooksNextArgs})
    args: ResolveBooksNextArgs,
  ): Promise<ResolveBooksNextReturn> {
    return this.seriesService.nextBooks(bookId, args);
  }
}

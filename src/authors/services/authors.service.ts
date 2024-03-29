import {Injectable} from '@nestjs/common';
import {int} from 'neo4j-driver';
import {OrderBy} from '../../common/order-by.enum';
import {Neo4jService} from '../../neo4j/neo4j.service';
import {AuthorEntity} from '../entities/author.entity';
import {WritingEntity} from '../entities/writing.entity';

@Injectable()
export class AuthorsService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findById(id: string): Promise<AuthorEntity> {
    const result = await this.neo4jService.read(
      `MATCH (n:Author {id: $id}) RETURN n`,
      {id},
    );
    if (result.records.length === 0) throw new Error('Not Found');
    return result.records[0].get(0).properties;
  }

  async findAll(): Promise<AuthorEntity[]> {
    return this.neo4jService
      .read(`MATCH (n:Author) RETURN n`)
      .then((res) => res.records.map((record) => record.get(0).properties));
  }

  async getWritingFromAuthor(
    authorId: string,
    {
      skip,
      limit,
      except,
      orderBy,
    }: {
      skip: number;
      limit: number;
      except: string[];
      orderBy: {title: OrderBy};
    },
  ): Promise<{
    nodes: WritingEntity[];
    count: number;
    hasPrevious: boolean;
    hasNext: boolean;
  }> {
    const writings = await this.neo4jService
      .read(
        `
    MATCH (a:Author {id: $authorId})
    MATCH (a)-[r:WRITED_BOOK]->(b)
    WHERE NOT b.id IN $except
    RETURN a,r,b
    ORDER BY b.title ${orderBy.title}
    SKIP $skip LIMIT $limit
    `,
        {
          authorId,
          skip: int(skip),
          limit: int(limit),
          except,
        },
      )
      .then((result) =>
        result.records.map((record) => ({
          ...record.get('r').properties,
          authorId: record.get('a').properties.id,
          bookId: record.get('b').properties.id,
        })),
      );
    const meta: {
      count: number;
      hasNext: boolean;
      hasPrevious: boolean;
    } = await this.neo4jService
      .read(
        `
      MATCH (:Author {id: $authorId})-[r:WRITED_BOOK]->(b:Book)
      WITH count(r) AS count
      RETURN count, 0 < count AND 0 < $skip AS previous, $skip + $limit < count AS next
      `,
        {
          authorId,
          skip: int(skip),
          limit: int(limit),
          except,
        },
      )
      .then((result) => ({
        count: result.records[0].get('count').toNumber(),
        hasNext: result.records[0].get('next'),
        hasPrevious: result.records[0].get('previous'),
      }));
    return {nodes: writings, ...meta};
  }

  async getWritingFromBook(
    bookId: string,
    {orderBy}: {orderBy: {name: OrderBy}},
  ): Promise<WritingEntity[]> {
    const result = await this.neo4jService.read(
      `
      MATCH (b:Book {id: $bookId})
      MATCH (a)-[r:WRITED_BOOK]->(b)
      RETURN a,r,b
      ORDER BY a.name ${orderBy.name}
    `,
      {bookId},
    );
    return result.records.map((record) => ({
      ...record.get('r').properties,
      authorId: record.get('a').properties.id,
      bookId: record.get('b').properties.id,
    }));
  }
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FileUploadResult {
  @Field()
  key: string;

  @Field()
  url: string;

  @Field()
  filename: string;

  @Field()
  mimetype: string;

  @Field()
  size: number;
}

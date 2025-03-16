import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { FileService } from './file-upload.service';
import { FileUploadResult } from './dto/file-upload.result';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';

@Resolver('File')
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => FileUploadResult)
  @UseGuards(GqlAuthGuard)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    fileUpload: FileUpload,
    @Args('folder', { nullable: true }) folder?: string,
  ): Promise<FileUploadResult> {
    const { createReadStream, filename, mimetype } = fileUpload;
    const stream = createReadStream();
    const buffer = await this.streamToBuffer(stream);

    const file = {
      buffer,
      originalname: filename,
      mimetype,
      size: buffer.length,
    } as Express.Multer.File;

    return this.fileService.uploadFile(file, folder);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteFile(@Args('key') key: string): Promise<boolean> {
    return this.fileService.deleteFile(key);
  }

  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  async getSignedUrl(
    @Args('key') key: string,
    @Args('expiresIn', { nullable: true }) expiresIn?: number,
  ): Promise<string> {
    return this.fileService.getSignedUrl(key, expiresIn);
  }

  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}

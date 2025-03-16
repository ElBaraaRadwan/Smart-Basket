import { Module } from '@nestjs/common';
import { FileService } from './file-upload.service';
import { FileResolver } from './file-upload.resolver';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [FileService, FileResolver],
  exports: [FileService],
})
export class FileModule {}

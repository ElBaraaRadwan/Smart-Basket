import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FileUploadService } from './file-upload.service';
import { CreateFileUploadInput } from './dto/create-file-upload.input';
import { UpdateFileUploadInput } from './dto/update-file-upload.input';

@Resolver('FileUpload')
export class FileUploadResolver {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Mutation('createFileUpload')
  create(@Args('createFileUploadInput') createFileUploadInput: CreateFileUploadInput) {
    return this.fileUploadService.create(createFileUploadInput);
  }

  @Query('fileUpload')
  findAll() {
    return this.fileUploadService.findAll();
  }

  @Query('fileUpload')
  findOne(@Args('id') id: number) {
    return this.fileUploadService.findOne(id);
  }

  @Mutation('updateFileUpload')
  update(@Args('updateFileUploadInput') updateFileUploadInput: UpdateFileUploadInput) {
    return this.fileUploadService.update(updateFileUploadInput.id, updateFileUploadInput);
  }

  @Mutation('removeFileUpload')
  remove(@Args('id') id: number) {
    return this.fileUploadService.remove(id);
  }
}

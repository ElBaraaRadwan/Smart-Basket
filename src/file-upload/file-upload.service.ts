import { Injectable } from '@nestjs/common';
import { CreateFileUploadInput } from './dto/create-file-upload.input';
import { UpdateFileUploadInput } from './dto/update-file-upload.input';

@Injectable()
export class FileUploadService {
  create(createFileUploadInput: CreateFileUploadInput) {
    return 'This action adds a new fileUpload';
  }

  findAll() {
    return `This action returns all fileUpload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fileUpload`;
  }

  update(id: number, updateFileUploadInput: UpdateFileUploadInput) {
    return `This action updates a #${id} fileUpload`;
  }

  remove(id: number) {
    return `This action removes a #${id} fileUpload`;
  }
}

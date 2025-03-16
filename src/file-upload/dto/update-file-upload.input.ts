import { CreateFileUploadInput } from './create-file-upload.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateFileUploadInput extends PartialType(CreateFileUploadInput) {
  id: number;
}

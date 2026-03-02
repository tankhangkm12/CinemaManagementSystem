import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
      if (!Types.ObjectId.isValid(value)){
          throw new BadRequestException('ID không hợp lệ')
      }
      return value
  }
}


@Injectable()
export class ParseEmailPipe implements PipeTransform {
    transform(value: string) {
        if (!isEmail(value)) {
            throw new BadRequestException('Email không hợp lệ')
        }
        return value
    }
}
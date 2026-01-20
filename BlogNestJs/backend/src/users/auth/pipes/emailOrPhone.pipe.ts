import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { SignInDto } from '../dto/signIn.dto';
import { ERROR_MESSAGES } from '../../../lib/constants';

@Injectable()
export class EmailOrPhonePipe implements PipeTransform {
  transform(value: SignInDto) {
    if (!value.email && !value.phone) {
      throw new BadRequestException(
        ERROR_MESSAGES.PASSWORD_EMAIL_OR_PHONE_REQUIRED,
      );
    }
    return value;
  }
}

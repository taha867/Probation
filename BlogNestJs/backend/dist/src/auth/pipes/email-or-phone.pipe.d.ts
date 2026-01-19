import { PipeTransform } from '@nestjs/common';
import { SignInDto } from '../dto/sign-in.dto';
export declare class EmailOrPhonePipe implements PipeTransform {
    transform(value: SignInDto): SignInDto;
}
//# sourceMappingURL=email-or-phone.pipe.d.ts.map
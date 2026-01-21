import { PipeTransform } from '@nestjs/common';
import { SignInDto } from '../dto/signIn-input.dto';
export declare class EmailOrPhonePipe implements PipeTransform {
    transform(value: SignInDto): SignInDto;
}
//# sourceMappingURL=emailOrPhone.pipe.d.ts.map
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule], // ConfigModule is global, but explicit import for clarity
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

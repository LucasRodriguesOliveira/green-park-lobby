import { ApiProperty } from '@nestjs/swagger';
import { randomBytes } from 'crypto';

export class CreateTicketReportResponseDto {
  @ApiProperty({
    type: String,
    example: randomBytes(100).toString('hex'),
  })
  base64: string;

  static from(file: Buffer): CreateTicketReportResponseDto {
    return {
      base64: file.toString('base64'),
    };
  }
}

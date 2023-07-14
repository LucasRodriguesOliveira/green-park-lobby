import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsGreaterThan } from '../../../decorators/is-greater-than.decorator';
import { ReportOptions } from '../type/report-options.enum';

export class QueryTicketDto {
  @ApiProperty({
    type: String,
    example: 'JOSÉ',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: Number,
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  startValue?: number;

  @ApiProperty({
    type: Number,
    example: 200,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsGreaterThan('startValue')
  finalValue?: number;

  @ApiProperty({
    type: Number,
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  batchId?: number;

  @ApiProperty({
    type: ReportOptions,
    required: false,
    example: ReportOptions.BASE64,
    default: ReportOptions.NO_REPORT,
    enum: ReportOptions,
    enumName: 'ReportOptions',
  })
  @IsOptional()
  @IsEnum(ReportOptions)
  report?: ReportOptions;
}

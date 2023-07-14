import {
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AppModule } from '../auth/decorator/app-module.decorator';
import { CreateBatchResponseDto } from '../batch/dto/create-batch-response.dto';
import { CreateTicketReportResponseDto } from './dto/create-ticket-report-response.dto';
import { ListTicketResponseDto } from './dto/list-ticket-response.dto';
import { QueryTicketDto } from './dto/query-ticket.dto';
import { TicketService } from './ticket.service';

@Controller('ticket')
@ApiTags('ticket')
@AppModule('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('integration')
  @ApiCreatedResponse({
    type: CreateBatchResponseDto,
    isArray: true,
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  public async uploadTicketCSV(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'text/csv' })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<CreateBatchResponseDto[]> {
    return this.ticketService.registerTicketsCSV(file);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse()
  public async uploadTicketPDF(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'application/pdf' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.ticketService.saveTicketsPDF(file);
  }

  @Get()
  @ApiExtraModels(CreateTicketReportResponseDto, ListTicketResponseDto)
  @ApiOkResponse({
    schema: {
      oneOf: [
        {
          $ref: getSchemaPath(CreateTicketReportResponseDto),
        },
        {
          $ref: getSchemaPath(ListTicketResponseDto),
          type: 'array',
        },
      ],
    },
    description:
      'Can either return a base64 or a resultList based on query option `report`',
  })
  public async test(
    @Query(ValidationPipe) queryTicketDto: QueryTicketDto,
  ): Promise<ListTicketResponseDto[] | CreateTicketReportResponseDto> {
    return this.ticketService.list(queryTicketDto);
  }
}

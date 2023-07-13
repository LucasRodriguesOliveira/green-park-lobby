import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessPermission } from '../auth/decorator/access-permission.decorator';
import { AppModule } from '../auth/decorator/app-module.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { BatchService } from './batch.service';
import { CreateBatchResponseDto } from './dto/create-batch-response.dto';
import { CreateBatchDto } from './dto/create-batch.dto';
import { FindBatchResponseDto } from './dto/find-batch-response.dto';
import { ListBatchResponseDto } from './dto/list-batch-response.dto';
import { QueryBatchDto } from './dto/query-batch.dto';
import { UpdateBatchResponseDto } from './dto/update-batch-response.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';

@Controller('batch')
@ApiTags('batch')
@AppModule('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListBatchResponseDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async list(
    @Query(ValidationPipe) queryBatchDto: QueryBatchDto,
  ): Promise<ListBatchResponseDto[]> {
    return this.batchService.list(queryBatchDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateBatchResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
  public async create(
    @Body(ValidationPipe) createBatchDto: CreateBatchDto,
  ): Promise<CreateBatchResponseDto> {
    return this.batchService.create(createBatchDto);
  }

  @Get(':batchId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindBatchResponseDto,
  })
  @ApiNotFoundResponse()
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('batchId', ParseIntPipe) batchId: number,
  ): Promise<FindBatchResponseDto> {
    let batch: FindBatchResponseDto;

    try {
      batch = await this.batchService.find(batchId);
    } catch (err) {
      throw new NotFoundException(`Batch [${batchId}] could not be found`);
    }

    return batch;
  }

  @Put(':batchId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateBatchResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('batchId', ParseIntPipe) batchId: number,
    @Body(ValidationPipe) updateBatchDto: UpdateBatchDto,
  ): Promise<UpdateBatchResponseDto> {
    return this.batchService.update(batchId, updateBatchDto);
  }

  @Delete(':batchId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('batchId', ParseIntPipe) batchId: number,
  ): Promise<boolean> {
    return this.batchService.delete(batchId);
  }
}

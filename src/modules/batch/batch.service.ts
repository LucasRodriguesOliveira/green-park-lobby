import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBatchResponseDto } from './dto/create-batch-response.dto';
import { CreateBatchDto } from './dto/create-batch.dto';
import { FindBatchResponseDto } from './dto/find-batch-response.dto';
import { ListBatchResponseDto } from './dto/list-batch-response.dto';
import { QueryBatchDto } from './dto/query-batch.dto';
import { UpdateBatchResponseDto } from './dto/update-batch-response.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Batch } from './entity/batch.entity';
import { BatchStatus } from './type/batch-status.enum';

@Injectable()
export class BatchService {
  constructor(
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
  ) {}

  public async find(batchId: number): Promise<FindBatchResponseDto> {
    const batch = await this.batchRepository.findOneByOrFail({ id: batchId });

    return FindBatchResponseDto.from(batch);
  }

  public async list({
    name,
    status,
  }: QueryBatchDto): Promise<ListBatchResponseDto[]> {
    const queryBuilder = this.batchRepository
      .createQueryBuilder('batch')
      .select('batch.id')
      .addSelect('batch.name');

    if (name) {
      queryBuilder.andWhere('batch.name = :name', { name });
    }

    if (status === BatchStatus.ACTIVE) {
      queryBuilder.andWhere('batch.status = true');
    } else if (status === BatchStatus.INACTIVE) {
      queryBuilder.andWhere('batch.status = false');
    }

    const batchList = await queryBuilder.getMany();

    return ListBatchResponseDto.from(batchList);
  }

  public async create(
    createBatchDto: CreateBatchDto,
  ): Promise<CreateBatchResponseDto> {
    const batch = await this.batchRepository.save({
      ...createBatchDto,
    });

    return CreateBatchResponseDto.from(batch);
  }

  public async update(
    batchId: number,
    { name }: UpdateBatchDto,
  ): Promise<UpdateBatchResponseDto> {
    await this.batchRepository.update({ id: batchId }, { name });

    const batch = await this.batchRepository.findOneBy({ id: batchId });

    return UpdateBatchResponseDto.from(batch);
  }

  public async delete(batchId: number): Promise<boolean> {
    const { affected } = await this.batchRepository.softDelete({ id: batchId });

    return affected > 0;
  }
}

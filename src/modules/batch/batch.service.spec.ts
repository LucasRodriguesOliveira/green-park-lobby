import { BatchService } from './batch.service';
import { Batch } from './entity/batch.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindBatchResponseDto } from './dto/find-batch-response.dto';
import { ListBatchResponseDto } from './dto/list-batch-response.dto';
import { CreateBatchDto } from './dto/create-batch.dto';
import { CreateBatchResponseDto } from './dto/create-batch-response.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { UpdateBatchResponseDto } from './dto/update-batch-response.dto';
import { BatchStatus } from './type/batch-status.enum';

describe('BatchService', () => {
  let service: BatchService;
  const getMany = jest.fn();
  const repository = {
    findOneBy: jest.fn(),
    findOneByOrFail: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany,
    })),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const batch: Batch = {
    id: 1,
    name: 'test',
    status: true,
    tickets: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        BatchService,
        { provide: getRepositoryToken(Batch), useValue: repository },
      ],
    }).compile();

    service = moduleRef.get<BatchService>(BatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find', () => {
    const expected = FindBatchResponseDto.from(batch);

    describe('success', () => {
      beforeAll(() => {
        repository.findOneByOrFail.mockResolvedValueOnce(batch);
      });

      it('should find a batch by id', async () => {
        const result = await service.find(batch.id);

        expect(repository.findOneByOrFail).toHaveBeenCalled();
        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('List', () => {
    const expected = ListBatchResponseDto.from([batch]);

    beforeAll(() => {
      getMany.mockResolvedValue([batch]);
    });

    it('should return a list of active batchs', async () => {
      const result = await service.list({ status: BatchStatus.ACTIVE });

      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(getMany).toHaveBeenCalled();
      expect(result).toStrictEqual(expected);
    });

    it('should return a list of inactive batchs', async () => {
      const result = await service.list({ status: BatchStatus.INACTIVE });

      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(getMany).toHaveBeenCalled();
      expect(result).toStrictEqual(expected);
    });
  });

  describe('Create', () => {
    const createBatchDto: CreateBatchDto = {
      name: 'test',
    };
    const expected = CreateBatchResponseDto.from(batch);

    beforeAll(() => {
      repository.save.mockResolvedValueOnce(batch);
    });

    it('should create a batch', async () => {
      const result = await service.create(createBatchDto);

      expect(repository.save).toHaveBeenCalled();
      expect(result).toStrictEqual(expected);
    });
  });

  describe('Update', () => {
    const updateBatchDto: UpdateBatchDto = {
      name: 'new name',
    };
    const expected = UpdateBatchResponseDto.from(batch);

    beforeAll(() => {
      repository.update.mockResolvedValueOnce({ affected: 1 });
      repository.findOneBy.mockResolvedValueOnce(batch);
    });

    it('should update a batch', async () => {
      const result = await service.update(batch.id, updateBatchDto);

      expect(repository.update).toHaveBeenCalled();
      expect(repository.findOneBy).toHaveBeenCalled();
      expect(result).toStrictEqual(expected);
    });
  });

  describe('Delete', () => {
    beforeAll(() => {
      repository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should soft delete a batch', async () => {
      const result = await service.delete(batch.id);

      expect(repository.softDelete).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});

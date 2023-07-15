import { BatchController } from '../../../src/modules/batch/batch.controller';
import { CreateBatchResponseDto } from '../../../src/modules/batch/dto/create-batch-response.dto';
import { CreateBatchDto } from '../../../src/modules/batch/dto/create-batch.dto';

interface CreateBatchOptions {
  batchController: BatchController;
}

export async function createBatch({
  batchController,
}: CreateBatchOptions): Promise<CreateBatchResponseDto> {
  const createBatchDto: CreateBatchDto = {
    name: 'TEST_BATCH',
  };

  return batchController.create(createBatchDto);
}

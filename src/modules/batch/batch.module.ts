import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Batch } from './entity/batch.entity';
import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Batch])],
  providers: [BatchService],
  controllers: [BatchController],
})
export class BatchModule {}

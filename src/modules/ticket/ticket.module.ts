import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entity/ticket.entity';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Batch } from '../batch/entity/batch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Batch])],
  providers: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}

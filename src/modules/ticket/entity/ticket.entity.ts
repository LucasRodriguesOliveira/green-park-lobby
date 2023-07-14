import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Batch } from '../../batch/entity/batch.entity';

@Entity({ name: 'ticket' })
export class Ticket {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @JoinColumn({
    foreignKeyConstraintName: 'Ticket_Batch_fk',
    name: 'batchId',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Batch, (batch) => batch.tickets)
  batch: Relation<Batch>;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 4,
    nullable: false,
    default: 0,
    transformer: {
      from: (value) => parseFloat(value),
      to: (value) => value,
    },
  })
  value: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  code: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}

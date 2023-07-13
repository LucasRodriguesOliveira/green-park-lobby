import { PermissionGroup } from '../../permission-group/entity/permission-group.entity';
import { User } from '../../../modules/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'user_type' })
export class UserType {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  description: string;

  @OneToMany(() => User, (user) => user.userType)
  users: Relation<User[]>;

  @OneToMany(
    () => PermissionGroup,
    (permissionGroup) => permissionGroup.userType,
  )
  permissionGroups: Relation<PermissionGroup[]>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}

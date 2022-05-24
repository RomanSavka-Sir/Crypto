import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity({
  name: 'userRoles'
})
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userRoles)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  roleId: string;

  @CreateDateColumn()
  createdAt: Date;
}

import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';

@Entity({
  name: 'photos'
})
export class Photo {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.photos)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  status: string;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}

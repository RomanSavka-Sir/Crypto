import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({
  name: 'generateEmailCode'
})
export class GenerateEmailCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 6
  })
  code: string;

  @Column({ nullable: true })
  usedAt: Date;

  @Column()
  expiredAt: Date;

  @ManyToOne(() => User, (user) => user.generateEmailCodes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}

import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Market } from './market.entity';

@Entity({
  name: 'orders'
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({ type: 'bigint' })
  price: number;

  @Column()
  volume: number;

  @Column({ default: 'open' })
  status: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Market, (market) => market.orders)
  @JoinColumn({ name: 'marketId' })
  market: Market;

  @Column()
  marketId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

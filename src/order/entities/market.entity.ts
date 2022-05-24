import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { Order } from './order.entity';
import { Trade } from './trade.entity';

@Entity({
  name: 'markets'
})
export class Market {
  @PrimaryColumn()
  id: string;

  @Column()
  status: string;

  @OneToMany(() => Order, (order) => order.market)
  orders: Order[];

  @OneToMany(() => Trade, (trade) => trade.market)
  trades: Trade[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

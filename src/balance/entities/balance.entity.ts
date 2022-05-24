import { Currency } from '../../shared/entities/currency.entity';
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

@Entity({
  name: 'balances'
})
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', default: 0 })
  amountInCents: number;

  @ManyToOne(() => User, (user) => user.balances)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Currency, (currency) => currency.balances)
  @JoinColumn({ name: 'currencyId' })
  currency: Currency;

  @Column()
  currencyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Length } from 'class-validator';
import { Balance } from '../../balance/entities/balance.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn
} from 'typeorm';

@Entity({
  name: 'currencies'
})
export class Currency {
  @PrimaryColumn()
  id: string;

  @Column({ length: 2 })
  @Length(2, 2)
  prefix: string;

  @OneToMany(() => Balance, (balance) => balance.currency)
  balances: Balance[];

  @CreateDateColumn()
  createdAt: Date;
}

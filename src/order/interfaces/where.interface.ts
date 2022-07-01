import { FindOperator } from 'typeorm';

export interface WhereInterface {
  userId: number;
  status?: string;
  createdAt?: FindOperator<string>;
  marketId?: string;
  currencyId?: string;
  price?: number;
  volume?: number;
}

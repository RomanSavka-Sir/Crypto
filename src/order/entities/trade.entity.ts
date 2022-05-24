import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Market } from "./market.entity";

@Entity({
    name: 'trades'
})
export class Trade {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'bigint' })
    price: number;

    @Column()
    volume: number;

    @Column()
    makerUserId: number;

    @Column()
    takerUserId: number;

    @ManyToOne(() => Market, market => market.trades)
    @JoinColumn({ name: 'marketId' })
    market: Market;

    @Column()
    marketId: string;

    @CreateDateColumn()
    createdAt: Date;
}

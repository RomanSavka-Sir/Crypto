import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { Balance } from '../../balance/entities/balance.entity';
import { Order } from '../../order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { UserRole } from './user.role.entity';
import { GenerateEmailCode } from 'src/auth/entities/generate.email.code.entity';
import { Photo } from 'src/shared/entities/photo.entity';

@Entity({
  name: 'users'
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  password: string;

  @Column({ default: 'tier0' })
  status: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  countryOfResidence?: string;

  @Column({ nullable: true })
  countryOfBirth?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  dateOfBirth?: string;

  @Column({ default: false })
  ['2fa']: boolean;

  @Column({ nullable: true })
  code2fa: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => Balance, (balance) => balance.user)
  balances: Balance[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(
    () => GenerateEmailCode,
    (generateEmailCode) => generateEmailCode.user
  )
  generateEmailCodes: GenerateEmailCode[];

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

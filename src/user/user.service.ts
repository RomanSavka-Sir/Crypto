import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { RoleEnum } from 'src/shared/enums/role.enum';
import { Repository, getManager } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user.role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email: email
      }
    });
  }

  async createUser(data: RegisterDto, adminId?: number) {
    return await getManager().transaction(async (transactionEntityManager) => {
      data.password = await bcrypt.hash(data.password, 10);

      const user = await transactionEntityManager
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({ ...data })
        .execute();

      await transactionEntityManager
        .createQueryBuilder()
        .insert()
        .into(UserRole)
        .values({
          userId: user.generatedMaps[0].id,
          roleId: adminId ? RoleEnum.manager : RoleEnum.user
        })
        .execute();

      return user;
    });
  }
}

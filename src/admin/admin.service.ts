import {
  Injectable,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AuthService } from 'src/auth/auth.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { Mailer } from 'src/shared/helpers/mailer';
import { UserService } from 'src/user/user.service';
import { CreateManagerDto } from './dto/create.manager.dto';
import RandExp from 'randexp';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { GetManagersResponseDto } from 'src/manager/dto/get.managers.response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/user/entities/user.role.entity';
import { getManager, In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ChangePasswordDto } from 'src/auth/dto/change.password.dto';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'src/shared/enums/role.enum';

@Injectable()
export class AdminService {
  constructor(
    private userService: UserService,
    private mailer: Mailer,
    private authService: AuthService,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async createManager(
    data: CreateManagerDto,
    adminId: number
  ): Promise<TokenDto> {
    try {
      const password = new RandExp(
        /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{10}$/
      ).gen();

      const user = await this.userService.createUser(
        { ...data, password },
        adminId
      );

      this.mailer.sendMail({
        from: process.env.SENDGRID_FROM,
        to: data.email,
        subject: 'Introduction for Manager',
        text: `Here you go password: ${password}. Please use it for login`
      });

      const token = await this.authService.generateAccessToken({
        id: String(user.generatedMaps[0].id)
      });

      return plainToClass(TokenDto, { token });
    } catch {
      throw new UnauthorizedException('Registration failed');
    }
  }

  async getAllManagers(
    pagination: PaginationDto
  ): Promise<GetManagersResponseDto> {
    const role = await this.userRoleRepository.find({
      where: {
        roleId: 'manager'
      }
    });

    const managerIds = role.map((id) => id.userId);

    const [managers, count] = await this.userRepository.findAndCount({
      where: { id: In(managerIds) },
      select: [
        'id',
        '2fa',
        'countryOfBirth',
        'countryOfResidence',
        'createdAt',
        'dateOfBirth',
        'email',
        'firstName',
        'lastName',
        'phone',
        'status',
        'updatedAt',
        'userRoles'
      ],
      skip: pagination.offset,
      take: pagination.limit,
      order: { id: 'DESC' }
    });

    return plainToClass(
      GetManagersResponseDto,
      { count, managers },
      { strategy: 'excludeAll' }
    );
  }

  async deleteManager(managerId: number): Promise<string> {
    try {
      return await getManager().transaction(
        async (transactionEntityManager) => {
          const userRole = await transactionEntityManager
            .createQueryBuilder()
            .delete()
            .from(UserRole)
            .where({ userId: managerId })
            .execute();

          if (!userRole.affected) throw new Error();

          const user = await transactionEntityManager
            .createQueryBuilder()
            .delete()
            .from(User)
            .where({ id: managerId })
            .execute();

          if (!user.affected) throw new Error();

          return `user ${managerId} was successfully deleted`;
        }
      );
    } catch {
      throw new BadRequestException('Delete manager was failed');
    }
  }

  async changeManagerPassword(
    data: ChangePasswordDto,
    userId: number
  ): Promise<string> {
    data.password = await bcrypt.hash(data.password, 10);
    try {
      await this.userRoleRepository.findOneOrFail({
        where: {
          userId,
          roleId: RoleEnum.manager
        }
      });

      const user = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ password: data.password })
        .where({ id: userId })
        .execute();

      if (!user.affected) throw new Error();

      return 'Password was changed successfully';
    } catch {
      throw new BadRequestException('Change password was failed');
    }
  }
}

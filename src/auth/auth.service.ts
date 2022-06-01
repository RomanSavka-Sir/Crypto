import {
  Injectable,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import { Repository, getManager, MoreThanOrEqual } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { TokenDto } from './dto/token.dto';
import { ValidationDto } from './dto/validation.dto';
import { UserStatusEnum } from 'src/user/enums/user.status.enum';
import { randomCode, under18 } from 'src/shared/helpers/helpers';
import { GenerateEmailCodeDto } from './dto/generate.email.code.dto';
import { GenerateEmailCode } from './entities/generate.email.code.entity';
import { Mailer } from 'src/shared/helpers/mailer';
import { ConfirmEmailDto } from './dto/confirm.email.dto';
import { UserRole } from 'src/user/entities/user.role.entity';
import { UserService } from 'src/user/user.service';
import { Photo } from 'src/shared/entities/photo.entity';
import { PhotoStatusEnum } from 'src/shared/enums/photo.status.enum';
import fs from 'fs';
import { ChangePasswordDto } from './dto/change.password.dto';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'src/shared/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    private mailer: Mailer,
    private userService: UserService
  ) {}

  async generateAccessToken(payload: { id: string }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async register({ email, password }: RegisterDto): Promise<TokenDto> {
    try {
      const user = await this.userService.createUser({ email, password });
      console.log(user);
      console.log(user.generatedMaps[0].id);

      const token = await this.generateAccessToken({
        id: String(user.generatedMaps[0].id)
      });

      return plainToClass(TokenDto, { token });
    } catch {
      throw new UnauthorizedException('Registration failed');
    }
  }

  async verification(userId: number, data: ValidationDto): Promise<void> {
    try {
      const checkDateOfBirth = under18(data.dateOfBirth);

      if (!checkDateOfBirth) throw new Error();

      const user = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ ...data, status: UserStatusEnum.tier1 })
        .where({ id: userId, status: UserStatusEnum.tier0 })
        .execute();

      if (!user.affected) {
        throw new Error();
      }
    } catch {
      throw new BadRequestException('Validation failed');
    }
  }

  async generateEmailCode(
    userId: number,
    data: GenerateEmailCodeDto
  ): Promise<void> {
    try {
      await getManager().transaction(async (transactionEntityManager) => {
        await transactionEntityManager.findOneOrFail(User, {
          where: {
            id: userId,
            email: data.email,
            status: UserStatusEnum.tier1
          }
        });
        const code = randomCode();

        const codeExpireAt = new Date();
        codeExpireAt.setDate(
          codeExpireAt.getDate() + +process.env.CODE_EXPIRE_IN_DAYS
        );

        await transactionEntityManager
          .createQueryBuilder()
          .insert()
          .into(GenerateEmailCode)
          .values({ expiredAt: codeExpireAt, code, userId })
          .execute();

        this.mailer.sendMail({
          from: process.env.SENDGRID_FROM,
          to: data.email,
          subject: 'Email Confirmation',
          text: `Here you go code: ${code}. Please use it for next step verification`
        });
      });
    } catch {
      throw new BadRequestException('Generate email code failed');
    }
  }

  async confirmEmail(userId: number, data: ConfirmEmailDto): Promise<string> {
    try {
      return await getManager().transaction(
        async (transactionEntityManager) => {
          const code = await transactionEntityManager
            .createQueryBuilder()
            .update(GenerateEmailCode)
            .set({ usedAt: new Date() })
            .where({
              userId,
              code: data.code,
              expiredAt: MoreThanOrEqual(new Date()),
              usedAt: null
            })
            .execute();

          if (!code.affected) throw new Error();

          const user = await transactionEntityManager
            .createQueryBuilder()
            .update(User)
            .set({ status: UserStatusEnum.tier2 })
            .where({ id: userId, status: UserStatusEnum.tier1 })
            .execute();

          if (!user.affected) throw new Error();

          return 'email successfully confirmed';
        }
      );
    } catch {
      throw new BadRequestException('Confirmation email failed');
    }
  }

  async uploadFile(userId: number, file): Promise<string> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          id: userId,
          status: UserStatusEnum.tier2
        },
        relations: ['photos']
      });

      if (user.photos.length > 0) {
        user.photos.forEach((photo) => {
          if (
            photo.status === PhotoStatusEnum.approved ||
            photo.status === PhotoStatusEnum.pending
          )
            throw new Error();
        });
      }

      await this.photoRepository
        .createQueryBuilder()
        .insert()
        .into(Photo)
        .values({
          status: PhotoStatusEnum.pending,
          userId,
          id: file.filename
        })
        .execute();

      return 'File successfully uploaded';
    } catch {
      fs.unlink(`${process.env.MULTER_DIST}/${file.filename}`, (err) => {
        if (err) {
          console.error(err);
        }
      });
      throw new BadRequestException('Uplode file was failed');
    }
  }

  async changePassword(
    data: ChangePasswordDto,
    userId: number
  ): Promise<string> {
    data.password = await bcrypt.hash(data.password, 10);
    try {
      const role = await this.userRolesRepository.findOneOrFail({
        where: {
          userId,
          roleId: RoleEnum.user
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

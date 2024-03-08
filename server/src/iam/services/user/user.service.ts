import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserStatus } from 'src/common/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    passwordHash: string,
  ) {
    //Check for existing users
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    //If user exists throw error depending on duplicate field
    if (existingUser?.email === email) {
      throw new BadRequestException(
        `A user with the email address "${email}" is already registered.`,
      );
    }

    if (existingUser?.username === username) {
      throw new BadRequestException(
        `A user with the username "${username}" is already registered.`,
      );
    }

    //Create user
    const user = this.userRepository.create({
      firstName,
      lastName,
      username,
      password: passwordHash,
      email,
      status: UserStatus.UNVERIFIED,
    });

    //Save user
    await this.userRepository.save(user);
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(
        'There are no registered users with the provided username.',
      );
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(
        'There are no registered users with the provided email.',
      );
    }

    return user;
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    return user;
  }

  async getUserPasswordResetTokens(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { passwordResetTokens: true },
    });

    return user.passwordResetTokens;
  }

  async getUserVerificationTokens(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { verificationTokens: true },
    });

    return user.verificationTokens;
  }

  async updatePassword(user: User, passwordHash: string) {
    const updatedUser = await this.userRepository.preload({
      ...user,
      password: passwordHash,
    });
    await this.userRepository.save(updatedUser);
  }

  async updateStatus(user: User, status: UserStatus) {
    const updatedUser = await this.userRepository.preload({ ...user, status });

    await this.userRepository.save(updatedUser);
  }
}

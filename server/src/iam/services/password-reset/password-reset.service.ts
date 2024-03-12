import { EmailService } from './../../../email/email.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { HashingService } from '../hashing/hashing.service';
import { ForgotPasswordDto } from 'src/iam/dto/forgot-password.dto';
import { RecoverPasswordDto } from 'src/iam/dto/recover-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordResetToken } from './entity/password-reset-token.entity';
import moment from 'moment';
import { customAlphabet } from 'nanoid';
import { PRT_EXPIRATION_INCREMENT_DAYS } from 'src/common/constants';
import { EmailPriority, EmailSubject, EmailTemplate } from 'src/common/enums';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    //Extract properties
    const { email } = forgotPasswordDto;

    //Get user
    const user = await this.userService.findByEmail(email);

    //Check if user has active tokens
    const passwordResetTokens =
      await this.userService.getUserPasswordResetTokens(user.id);

    const activePasswordRestTokens = passwordResetTokens.filter((token) => {
      const expiryDate = moment(token.expiryDate);
      const now = moment();
      return expiryDate.isAfter(now);
    });

    //Delete active tokens
    for (const token of activePasswordRestTokens) {
      await this.passwordResetTokenRepository.delete(token.id);
    }

    //Generate password reset token
    const tokenValue = await this.generateTokenString();

    //Expiry date
    const now = new Date();
    const expiryDate = new Date(
      now.setDate(now.getDate() + PRT_EXPIRATION_INCREMENT_DAYS),
    );

    //Create password reset token
    const passwordResetToken = await this.passwordResetTokenRepository.create({
      user,
      tokenValue,
      expiryDate,
    });

    //Save token to db
    await this.passwordResetTokenRepository.save(passwordResetToken);

    //Email password reset token
    await this.emailService.send(
      email,
      EmailTemplate.PASSWORD_CHANGE,
      EmailSubject.PASSWORD_CHANGE,
      {
        firstName: user.firstName,
        passwordChangeLink: `${this.configService.get<string>('frontEndUrl')}/password-change/${tokenValue}`,
      },
      EmailPriority.HIGH,
    );
  }

  async recoverPassword(recoverPasswordDto: RecoverPasswordDto) {
    //Extract properties
    const { tokenValue, newPassword } = recoverPasswordDto;

    //Get token
    const token = await this.passwordResetTokenRepository.findOne({
      where: { tokenValue },
      relations: { user: true },
    });

    //If no token exists throw error
    if (!token) {
      throw new NotFoundException('Invalid token.');
    }

    //If token has expired throw error
    const expiryDate = moment(token.expiryDate);
    const now = moment();

    if (expiryDate.isBefore(now)) {
      throw new BadRequestException('Token has expired.');
    }

    //Extract token user
    const { user } = token;

    //Delete token
    await this.passwordResetTokenRepository.delete(token.id);

    //Hash new password
    const passwordHash = await this.hashingService.hash(newPassword);

    //Update user password
    await this.userService.updatePassword(user, passwordHash);
  }

  private async generateTokenString() {
    const nanoid = customAlphabet(
      '1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm',
    );
    const token = await nanoid(9);
    return token;
  }
}

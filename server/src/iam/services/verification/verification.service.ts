import { EmailService } from './../../../email/email.service';
import { UserService } from './../user/user.service';
import { RequestVerificationDto } from '../../dto/request-verification.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VerificationToken } from './entity/verification-token.entity';
import { Repository } from 'typeorm';
import moment from 'moment';
import { VERIFY_EXPIRATION_INCREMENT_DAYS } from 'src/common/constants';
import { customAlphabet } from 'nanoid';
import {
  EmailPriority,
  EmailSubject,
  EmailTemplate,
  UserStatus,
} from 'src/common/enums';
import { VerifyDto } from 'src/iam/dto/verify.dto';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(VerificationToken)
    private readonly verificationTokenRepository: Repository<VerificationToken>,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async requestVerification(requestVerificationDto: RequestVerificationDto) {
    //Extract properties
    const { email } = requestVerificationDto;

    //Get user
    const user = await this.userService.findByEmail(email);

    //Check if user is already verified
    if (user.status === UserStatus.VERIFIED) {
      throw new BadRequestException('User is already verified.');
    }

    //Check if user has active tokens
    const verificationTokens = await this.userService.getUserVerificationTokens(
      user.id,
    );

    const activeVerificationTokens = verificationTokens.filter((token) => {
      const expiryDate = moment(token.expiryDate);
      const now = moment();
      return expiryDate.isAfter(now);
    });

    //Delete active tokens
    for (const token of activeVerificationTokens) {
      await this.verificationTokenRepository.delete(token.id);
    }

    //Generate password reset token
    const tokenValue = await this.generateTokenString();

    //Expiry date
    const now = new Date();
    const expiryDate = new Date(
      now.setDate(now.getDate() + VERIFY_EXPIRATION_INCREMENT_DAYS),
    );

    //Create verification token
    const verificationToken = await this.verificationTokenRepository.create({
      user,
      tokenValue,
      expiryDate,
    });

    //Save token to db
    await this.verificationTokenRepository.save(verificationToken);

    //Email verification token
    await this.emailService.send(
      email,
      EmailTemplate.VERIFICATION,
      EmailSubject.VERIFICATION,
      {
        firstName: user.firstName,
        verificationCode: tokenValue,
        verificationLink: `http://localhost:3000/verify/${tokenValue}`,
      },
      EmailPriority.HIGH,
    );
  }

  async verify(verifyDto: VerifyDto) {
    //Extract properties
    const { tokenValue } = verifyDto;

    //Get token
    const token = await this.verificationTokenRepository.findOne({
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
    await this.verificationTokenRepository.delete(token.id);

    //Update user status
    await this.userService.updateStatus(user, UserStatus.VERIFIED);
  }

  private async generateTokenString() {
    const nanoid = customAlphabet(
      '1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm',
    );
    const token = await nanoid(9);
    return token;
  }
}

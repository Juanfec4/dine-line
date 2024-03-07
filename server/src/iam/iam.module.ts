import { Module } from '@nestjs/common';
import { AuthnService } from './services/authn/authn.service';
import { JwtService } from './services/jwt/jwt.service';
import { UserService } from './services/user/user.service';
import { HashingService } from './services/hashing/hashing.service';
import { IamController } from './iam.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './services/user/entity/user.entity';
import { PasswordResetService } from './services/password-reset/password-reset.service';
import { PasswordResetToken } from './services/password-reset/entity/password-reset-token.entity';
import { VerificationService } from './services/verification/verification.service';
import { VerificationToken } from './services/verification/entity/verification-token.entity';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, PasswordResetToken, VerificationToken]),
    EmailModule,
  ],
  providers: [
    AuthnService,
    JwtService,
    UserService,
    HashingService,
    PasswordResetService,
    VerificationService,
  ],
  controllers: [IamController],
  exports: [UserService, JwtService],
})
export class IamModule {}

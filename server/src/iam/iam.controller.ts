import { PasswordResetService } from './services/password-reset/password-reset.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { TTL_ONE_MINUTE } from './../common/constants';
import { RequestVerificationDto } from './dto/request-verification.dto';
import { VerificationService } from './services/verification/verification.service';
import { VerifyDto } from './dto/verify.dto';
import { LoginDto } from './dto/login.dto';
import { AuthnService } from './services/authn/authn.service';

import { RegisterDto } from './dto/register.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { TTL_ONE_HOUR } from 'src/common/constants';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('iam')
export class IamController {
  constructor(
    private readonly authnService: AuthnService,
    private readonly verificationService: VerificationService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authnService.register(registerDto);
  }

  @Throttle({ custom: { limit: 5, ttl: TTL_ONE_HOUR } })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authnService.login(loginDto);
  }

  @Get('refresh/:token')
  async refresh(@Param('token') token: string) {
    return await this.authnService.refresh(token);
  }

  @Patch('verify')
  async verify(@Body() verifyDto: VerifyDto) {
    return await this.verificationService.verify(verifyDto);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Throttle({ custom: { limit: 1, ttl: TTL_ONE_MINUTE } })
  @Post('request-verification')
  async requestVerification(
    @Body() requestVerificationDto: RequestVerificationDto,
  ) {
    return await this.verificationService.requestVerification(
      requestVerificationDto,
    );
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Throttle({ custom: { limit: 1, ttl: TTL_ONE_MINUTE } })
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.passwordResetService.forgotPassword(forgotPasswordDto);
  }

  @Patch('recover-password')
  async recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
    return await this.passwordResetService.recoverPassword(recoverPasswordDto);
  }
}

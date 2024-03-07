import { IN_7_DAYS } from './../../../common/constants';
import { JwtService } from './../jwt/jwt.service';
import { HashingService } from './../hashing/hashing.service';
import { UserService } from './../user/user.service';
import { RegisterDto } from './../../dto/register.dto';
import { LoginDto } from './../../dto/login.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IN_1_HOUR } from 'src/common/constants';

@Injectable()
export class AuthnService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    //Extract properties
    const { username, password } = loginDto;

    //Get user
    const user = await this.userService.findByUsername(username);

    //Compare passwords
    const isMatch = await this.hashingService.compare(password, user.password);

    //If passwords do not match throw error
    if (!isMatch) throw new UnauthorizedException(`Invalid password.`);

    //Generate tokens
    const accessToken = await this.jwtService.generateToken(
      'access',
      { sub: user.id },
      IN_1_HOUR,
    );

    const refreshToken = await this.jwtService.generateToken(
      'refresh',
      { sub: user.id },
      IN_7_DAYS,
    );

    //Send tokens back to client
    return { accessToken, refreshToken };
  }

  async register(registerDto: RegisterDto) {
    //Extract properties
    const { firstName, lastName, username, email, password } = registerDto;

    //Hash password
    const passwordHash = await this.hashingService.hash(password);

    //Create user
    await this.userService.create(
      firstName,
      lastName,
      username,
      email,
      passwordHash,
    );
  }

  async refresh(token: string) {
    //Verify token
    const isValid = await this.jwtService.verifyToken('refresh', token);

    //If token is invalid throw error
    if (!isValid) throw new UnauthorizedException('Invalid refresh token.');

    //Decode token
    const decoded = await this.jwtService.decodeToken(token);

    //Generate new access token
    const accessToken = await this.jwtService.generateToken(
      'access',
      { sub: Number(decoded.sub) },
      IN_1_HOUR,
    );

    //Send new token back to client
    return { accessToken };
  }
}

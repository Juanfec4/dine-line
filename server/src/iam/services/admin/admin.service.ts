import { IN_7_DAYS } from './../../../common/constants';
import { AdminLoginDto } from './../../dto/admin-login.dto';
import { Admin } from './admin.entity.dto';
import { HashingService } from './../hashing/hashing.service';
import { JwtService } from './../jwt/jwt.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IN_1_HOUR } from 'src/common/constants';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  async create(username: string, password: string) {
    const existingAdmins = await this.adminRepository.find();

    //Only one admin can exist
    if (existingAdmins.length > 0) {
      return;
    }

    const passwordHash = await this.hashingService.hash(password);
    const admin: Partial<Admin> = { username, password: passwordHash };

    const createdAdmin = await this.adminRepository.create(admin);

    await this.adminRepository.save(createdAdmin);
  }

  async login(adminLoginDto: AdminLoginDto) {
    const { username, password } = adminLoginDto;

    const admin = await this.adminRepository.findOne({ where: { username } });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isValidPassword = await this.hashingService.compare(
      password,
      admin.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const adminAccessToken = await this.jwtService.generateToken(
      'access',
      {
        sub: admin.id,
        isAdmin: 1,
      },
      IN_1_HOUR,
    );

    const adminRefreshToken = await this.jwtService.generateToken(
      'refresh',
      {
        sub: admin.id,
        isAdmin: 1,
      },
      IN_7_DAYS,
    );

    return { adminAccessToken, adminRefreshToken };
  }

  async refresh(token: string) {
    //Verify token
    const isValid = await this.jwtService.verifyToken('refresh', token);

    //If token is invalid throw error
    if (!isValid)
      throw new UnauthorizedException('Invalid admin refresh token.');

    //Decode token
    const decoded = await this.jwtService.decodeToken(token);

    //Generate new access token
    const adminAccessToken = await this.jwtService.generateToken(
      'access',
      { sub: Number(decoded.sub), isAdmin: Number(decoded.isAdmin) },
      IN_1_HOUR,
    );

    //Send new token back to client
    return { adminAccessToken };
  }

  async getById(id: number) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    return admin;
  }
}

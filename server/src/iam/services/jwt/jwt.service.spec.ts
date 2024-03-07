import { IN_1_HOUR, IN_7_DAYS } from './../../../common/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'jwt.refreshTokenSecret') return 'refresh';
              if (key === 'jwt.accessTokenSecret') return 'access';
            }),
          },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should generate access tokens', async () => {
    const payload = { sub: 10 };
    const token = await service.generateToken('access', payload, IN_1_HOUR);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should generate refresh tokens', async () => {
    const payload = { sub: 10 };
    const token = await service.generateToken('refresh', payload, IN_7_DAYS);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should check invalid tokens', async () => {
    const invalidToken = 'invalid';
    expect(await service.verifyToken('access', invalidToken)).toBe(false);
    expect(await service.verifyToken('refresh', invalidToken)).toBe(false);
  });

  it('should check valid tokens', async () => {
    const payload = { sub: 10 };
    const accessToken = await service.generateToken(
      'access',
      payload,
      IN_1_HOUR,
    );
    const refreshToken = await service.generateToken(
      'refresh',
      payload,
      IN_7_DAYS,
    );
    expect(await service.verifyToken('access', accessToken)).toBe(true);
    expect(await service.verifyToken('refresh', refreshToken)).toBe(true);
  });

  it('should decode access tokens', async () => {
    const payload = { sub: 10 };
    const token = await service.generateToken('access', payload, IN_1_HOUR);
    const decoded = await service.decodeToken(token);
    expect(decoded).toBeDefined();
    expect(decoded.sub).toBe(payload.sub);
  });
});

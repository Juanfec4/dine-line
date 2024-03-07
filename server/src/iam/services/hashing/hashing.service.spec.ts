import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from './hashing.service';

describe('HashingService', () => {
  let service: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashingService],
    }).compile();

    service = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash inputs', async () => {
    const input = 'test';
    const hash = await service.hash(input);
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
    expect(hash === input).toBe(false);
  });

  it('should identify valid hashes', async () => {
    const input = 'test';
    const hash = await service.hash(input);
    expect(await service.compare(input, hash)).toBe(true);
  });

  it('should identify invalid hashes', async () => {
    const input = 'test';
    const invalid = 'invalid';
    const hash = await service.hash(input);
    expect(await service.compare(invalid, hash)).toBe(false);
  });
});

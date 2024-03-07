import { AuthnGuard } from './authn.guard';

describe('AuthnGuard', () => {
  it('should be defined', () => {
    expect(new AuthnGuard()).toBeDefined();
  });
});

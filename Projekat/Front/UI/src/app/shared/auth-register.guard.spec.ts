import { TestBed } from '@angular/core/testing';

import { AuthRegisterGuard } from './auth-register.guard';

describe('AuthRegisterGuard', () => {
  let guard: AuthRegisterGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthRegisterGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

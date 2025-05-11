import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authCanActivateGuard } from './auth-can-activate.guard';

describe('authCanActivateGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authCanActivateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

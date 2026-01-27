import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authGuard } from './auth-guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => {
      const guardAny: any = authGuard as any;
      if (typeof guardAny === 'function') {
        return guardAny(...guardParameters);
      }
      const instance: any = TestBed.inject(authGuard as any);
      const fn = instance && (instance.canActivate ?? instance);
      return fn(...guardParameters);
    });

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

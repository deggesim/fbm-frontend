import { TestBed } from '@angular/core/testing';

import { TenantInterceptor } from './tenant-interceptor.service';

describe('TenantInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TenantInterceptor = TestBed.inject(TenantInterceptor);
    expect(service).toBeTruthy();
  });
});

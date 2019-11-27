import { TestBed, inject } from '@angular/core/testing';

import { GlobalInterceptor } from './global-interceptor.service';

describe('GlobalInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalInterceptor]
    });
  });

  it('should be created', inject([GlobalInterceptor], (service: GlobalInterceptor) => {
    expect(service).toBeTruthy();
  }));
});

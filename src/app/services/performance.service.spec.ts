import { TestBed } from '@angular/core/testing';

import { PerformanceService } from './performance.service';

describe('PerformanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PerformanceService = TestBed.inject(PerformanceService);
    expect(service).toBeTruthy();
  });
});

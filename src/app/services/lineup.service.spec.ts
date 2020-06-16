import { TestBed } from '@angular/core/testing';

import { LineupService } from './lineup.service';

describe('LineupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LineupService = TestBed.inject(LineupService);
    expect(service).toBeTruthy();
  });
});

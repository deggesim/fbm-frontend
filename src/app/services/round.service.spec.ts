import { TestBed } from '@angular/core/testing';

import { RoundService } from './round.service';

describe('RoundService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoundService = TestBed.inject(RoundService);
    expect(service).toBeTruthy();
  });
});

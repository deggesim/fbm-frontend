import { TestBed } from '@angular/core/testing';

import { NewSeasonService } from './new-season.service';

describe('NewSeasonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewSeasonService = TestBed.inject(NewSeasonService);
    expect(service).toBeTruthy();
  });
});
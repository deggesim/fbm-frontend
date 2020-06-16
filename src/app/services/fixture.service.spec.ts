import { TestBed } from '@angular/core/testing';

import { FixtureService } from './fixture.service';

describe('FixtureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FixtureService = TestBed.inject(FixtureService);
    expect(service).toBeTruthy();
  });
});

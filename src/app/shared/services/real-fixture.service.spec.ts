import { TestBed } from '@angular/core/testing';

import { RealFixtureService } from './real-fixture.service';

describe('RealFixtureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RealFixtureService = TestBed.inject(RealFixtureService);
    expect(service).toBeTruthy();
  });
});

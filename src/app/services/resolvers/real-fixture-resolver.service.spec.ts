import { TestBed } from '@angular/core/testing';

import { RealFixtureResolverService } from './real-fixture-resolver.service';

describe('RealFixtureResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RealFixtureResolverService = TestBed.get(RealFixtureResolverService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { RoundResolverService } from './round-resolver.service';

describe('RoundResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoundResolverService = TestBed.inject(RoundResolverService);
    expect(service).toBeTruthy();
  });
});

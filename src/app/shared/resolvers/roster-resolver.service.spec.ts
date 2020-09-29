import { TestBed } from '@angular/core/testing';

import { RosterResolverService } from './roster-resolver.service';

describe('RosterResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RosterResolverService = TestBed.inject(RosterResolverService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { LeagueResolverService } from './league-resolver.service';

describe('LeagueResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeagueResolverService = TestBed.inject(LeagueResolverService);
    expect(service).toBeTruthy();
  });
});

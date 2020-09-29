import { TestBed } from '@angular/core/testing';

import { FantasyTeamResolverService } from './fantasy-team-resolver.service';

describe('FantasyTeamResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FantasyTeamResolverService = TestBed.inject(FantasyTeamResolverService);
    expect(service).toBeTruthy();
  });
});

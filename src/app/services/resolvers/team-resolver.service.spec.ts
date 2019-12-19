import { TestBed } from '@angular/core/testing';

import { TeamResolverService } from './team-resolver.service';

describe('TeamResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TeamResolverService = TestBed.get(TeamResolverService);
    expect(service).toBeTruthy();
  });
});

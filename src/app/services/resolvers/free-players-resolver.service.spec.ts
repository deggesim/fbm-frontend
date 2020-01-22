import { TestBed } from '@angular/core/testing';

import { FreePlayersResolverService } from './free-players-resolver.service';

describe('FreePlayersResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FreePlayersResolverService = TestBed.get(FreePlayersResolverService);
    expect(service).toBeTruthy();
  });
});

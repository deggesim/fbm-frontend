import { TestBed } from '@angular/core/testing';

import { PlayerResolverService } from './player-resolver.service';

describe('PlayerResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayerResolverService = TestBed.inject(PlayerResolverService);
    expect(service).toBeTruthy();
  });
});

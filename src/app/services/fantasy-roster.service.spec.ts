import { TestBed } from '@angular/core/testing';

import { FantasyRosterService } from './fantasy-roster.service';

describe('FantasyRosterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FantasyRosterService = TestBed.get(FantasyRosterService);
    expect(service).toBeTruthy();
  });
});
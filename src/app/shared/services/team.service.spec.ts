import { TestBed } from '@angular/core/testing';

import { TeamService } from './team.service';

describe('TeamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TeamService = TestBed.inject(TeamService);
    expect(service).toBeTruthy();
  });
});

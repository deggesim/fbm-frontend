import { Component, Input, OnInit } from '@angular/core';
import { Fixture } from '@app/models/fixture';
import { Lineup } from '@app/models/lineup';
import { Match } from '@app/models/match';
import { LineupService } from '@app/shared/services/lineup.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'fbm-match-result',
  templateUrl: './match-result.component.html',
})
export class MatchResultComponent implements OnInit {
  @Input() fixture: Fixture;
  @Input() match: Match;

  homeTeamLineup: Lineup[];
  awayTeamLineup: Lineup[];

  constructor(private lineupService: LineupService) {}

  ngOnInit(): void {
    if (this.match != null) {
      this.loadLineups(this.match).subscribe((lineups: [Lineup[], Lineup[]]) => {
        this.homeTeamLineup = lineups[0];
        this.awayTeamLineup = lineups[1];
      });
    }
  }

  private loadLineups(match: Match): Observable<[Lineup[], Lineup[]]> {
    const homeTeam = match.homeTeam;
    const awayTeam = match.awayTeam;
    const $homeTeamLineup = this.lineupService.lineupByTeam(homeTeam._id, this.fixture._id);
    const $awayTeamLineup = this.lineupService.lineupByTeam(awayTeam._id, this.fixture._id);
    return forkJoin([$homeTeamLineup, $awayTeamLineup]);
  }
}

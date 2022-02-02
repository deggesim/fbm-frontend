import { Component, Input } from '@angular/core';
import { Fixture } from '@app/models/fixture';
import { Lineup } from '@app/models/lineup';
import { Match } from '@app/models/match';

@Component({
  selector: 'fbm-match-result',
  templateUrl: './match-result.component.html',
})
export class MatchResultComponent {
  @Input() fixture: Fixture;
  @Input() match: Match;
  @Input() homeTeamLineup: Lineup[];
  @Input() awayTeamLineup: Lineup[];
}

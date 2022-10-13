import { Component, Input, OnInit, Optional } from '@angular/core';
import { UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { Fixture } from '@app/models/fixture';
import { Lineup } from '@app/models/lineup';
import { Match } from '@app/models/match';

@Component({
  selector: 'fbm-match-result',
  templateUrl: './match-result.component.html',
  styleUrls: ['./match-result.component.scss'],
})
export class MatchResultComponent implements OnInit {
  @Input() fixture: Fixture;
  @Input() match: Match;
  @Input() homeTeamLineup: Lineup[];
  @Input() awayTeamLineup: Lineup[];

  form: UntypedFormGroup;

  constructor(@Optional() private rootFormGroup: FormGroupDirective) {}

  ngOnInit(): void {
    this.form = this.rootFormGroup?.control;
  }
}

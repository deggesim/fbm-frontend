import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppState } from '@app/core/app.state';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { selectedLeague } from '@app/core/league/store/league.selector';
import { League } from '@app/models/league';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Component({
  selector: 'fbm-parameters',
  templateUrl: './parameters.component.html',
})
export class ParametersComponent implements OnInit {
  form = this.fb.group({
    DRAFT: [20, Validators.required],
    MAX_CONTRACTS: [21, Validators.required],
    MAX_STR: [6, Validators.required],
    MAX_EXT_OPT_345: [6, Validators.required],
    MAX_PLAYERS_IN_ROSTER: [18, Validators.required],
    MAX_STRANGERS_OPT_55: [6, Validators.required],
    MIN_NAT_PLAYERS: [5, Validators.required],
    RESULT_DIVISOR: [2, Validators.required],
    RESULT_WITH_GRADE: [1, Validators.required],
    RESULT_WITH_OER: [0, Validators.required],
    RESULT_WITH_PLUS_MINUS: [0, Validators.required],
    TREND: [5, Validators.required],
  });

  constructor(private fb: FormBuilder, private store: Store<AppState>) {}

  ngOnInit() {
    this.store.pipe(select(selectedLeague), take(1)).subscribe((league: League) => {
      for (const param of league.parameters) {
        this.form.get(param.parameter).setValue(param.value);
      }
    });
  }

  save() {
    const parameters: { parameter: string; value: string }[] = [];
    Object.keys(this.form.controls).forEach((key) => {
      parameters.push({ parameter: key, value: this.form.get(key).value });
    });
    this.store.dispatch(LeagueActions.editParameters({ parameters }));
  }
}

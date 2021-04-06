import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState } from '@app/core/app.state';
import { LeagueService } from '@app/core/league/services/league.service';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { selectedLeague } from '@app/core/league/store/league.selector';
import { League } from '@app/models/league';
import { ToastService } from '@app/shared/services/toast.service';
import { select, Store } from '@ngrx/store';
import { concatMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
})
export class ParametersComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private leagueService: LeagueService,
    private toastService: ToastService,
    private store: Store<AppState>
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.store.pipe(select(selectedLeague)).subscribe((league: League) => {
      for (const param of league.parameters) {
        this.form.get(param.parameter).setValue(param.value);
      }
    });
  }

  createForm() {
    this.form = this.fb.group({
      DRAFT: [20, Validators.required],
      MAX_CONTRACTS: [21, Validators.required],
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
  }

  salva() {
    const parameters = [];
    Object.keys(this.form.controls).forEach((key) => {
      parameters.push({ parameter: key, value: this.form.controls[key].value });
    });

    this.store
      .pipe(
        select(selectedLeague),
        take(1),
        concatMap((league: League) => this.leagueService.setParameters(league._id, parameters)),
        tap((league: League) => {
          this.store.dispatch(LeagueActions.setSelectedLeague({ league }));
        }),
        tap(() => {
          this.store.dispatch(LeagueInfoActions.refresh());
        })
      )
      .subscribe(() => {
        const title = 'Modifica parametri';
        const message = 'I parametri della lega sono stati modificati con successo';
        this.toastService.success(title, message);
      });
  }
}

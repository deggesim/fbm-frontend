import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { toastType } from '@app/shared/constants/globals';
import { League } from '@app/shared/models/league';
import { AuthService } from '@app/shared/services/auth.service';
import { LeagueService } from '@app/shared/services/league.service';
import { NewSeasonService } from '@app/shared/services/new-season.service';
import { SharedService } from '@app/shared/services/shared.service';
import { refresh } from '@app/store/actions/league-info.actions';
import { setSelectedLeague } from '@app/store/actions/league.actions';
import { selectedLeague } from '@app/store/selectors/league.selector';
import { select, Store } from '@ngrx/store';
import { concatMap, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss'],
})
export class ParametersComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private leagueService: LeagueService,
    private newSeasonService: NewSeasonService,
    private sharedService: SharedService,
    private store: Store
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('ParametersComponent');
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
        concatMap((league: League) => this.newSeasonService.setParameters(league._id, parameters)),
        tap((league: League) => {
          this.store.dispatch(setSelectedLeague({ league }));
        }),
        tap(() => {
          this.store.dispatch(refresh());
        })
      )
      .subscribe(() => {
        const title = 'Modifica parametri';
        const message = 'I parametri della lega sono stati modificati con successo';
        this.sharedService.notifica(toastType.success, title, message);
      });
  }
}

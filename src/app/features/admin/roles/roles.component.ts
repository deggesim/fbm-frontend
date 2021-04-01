import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState } from '@app/core/app.state';
import { LeagueService } from '@app/core/league/services/league.service';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { selectedLeague } from '@app/core/league/store/league.selector';
import { League } from '@app/models/league';
import { toastType } from '@app/shared/constants/globals';
import { SharedService } from '@app/shared/services/shared.service';
import { select, Store } from '@ngrx/store';
import { concatMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
})
export class RolesComponent implements OnInit {
  form: FormGroup;

  spots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(
    private fb: FormBuilder,
    private leagueService: LeagueService,
    private sharedService: SharedService,
    private store: Store<AppState>
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.store.pipe(select(selectedLeague)).subscribe((league: League) => {
      for (const role of league.roles) {
        this.form.get(role.role).setValue(role.spots);
      }
    });
  }

  createForm() {
    this.form = this.fb.group({
      Playmaker: [undefined, Validators.required],
      'Play/Guardia': [undefined, Validators.required],
      Guardia: [undefined, Validators.required],
      'Guardia/Ala': [undefined, Validators.required],
      Ala: [undefined, Validators.required],
      'Ala/Centro': [undefined, Validators.required],
      Centro: [undefined, Validators.required],
    });
  }

  salva() {
    const roles = [];
    Object.keys(this.form.controls).forEach((key) => {
      roles.push({ role: key, spots: this.form.controls[key].value });
    });

    this.store
      .pipe(
        select(selectedLeague),
        concatMap((league: League) => this.leagueService.setRoles(league._id, roles)),
        tap((league: League) => {
          this.store.dispatch(LeagueActions.setSelectedLeague({ league }));
          this.store.dispatch(LeagueInfoActions.refresh());
        })
      )
      .subscribe(() => {
        const title = 'Modifica ruoli';
        const message = 'I ruoli della lega sono stati modificati con successo';
        this.sharedService.notifica(toastType.success, title, message);
      });
  }
}

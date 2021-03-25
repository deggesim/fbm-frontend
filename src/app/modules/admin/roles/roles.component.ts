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
import { concatMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
  form: FormGroup;

  spots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
        concatMap((league: League) => this.newSeasonService.setRoles(league._id, roles)),
        tap((league: League) => {
          this.store.dispatch(setSelectedLeague({ league }));
          this.store.dispatch(refresh());
        })
      )
      .subscribe(() => {
        const title = 'Modifica ruoli';
        const message = 'I ruoli della lega sono stati modificati con successo';
        this.sharedService.notifica(toastType.success, title, message);
      });
  }
}

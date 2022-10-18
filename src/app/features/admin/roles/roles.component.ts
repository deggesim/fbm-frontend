import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppState } from '@app/core/app.state';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { selectedLeague } from '@app/core/league/store/league.selector';
import { League } from '@app/models/league';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Component({
  selector: 'fbm-roles',
  templateUrl: './roles.component.html',
})
export class RolesComponent implements OnInit {
  form = this.fb.group({
    Playmaker: [null as number[], Validators.required],
    'Play/Guardia': [null as number[], Validators.required],
    Guardia: [null as number[], Validators.required],
    'Guardia/Ala': [null as number[], Validators.required],
    Ala: [null as number[], Validators.required],
    'Ala/Centro': [null as number[], Validators.required],
    Centro: [null as number[], Validators.required],
  });

  spots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(private fb: FormBuilder, private store: Store<AppState>) {}

  ngOnInit() {
    this.store.pipe(select(selectedLeague), take(1)).subscribe((league: League) => {
      for (const role of league.roles) {
        this.form.get(role.role).setValue(role.spots);
      }
    });
  }

  save() {
    const roles: { role: string; spots: any }[] = [];
    Object.keys(this.form.controls).forEach((key) => {
      roles.push({ role: key, spots: this.form.get(key).value });
    });

    this.store.dispatch(LeagueActions.editRoles({ roles }));
  }
}

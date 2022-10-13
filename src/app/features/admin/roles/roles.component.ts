import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
  form: UntypedFormGroup;

  spots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(private fb: UntypedFormBuilder, private store: Store<AppState>) {
    this.createForm();
  }

  ngOnInit() {
    this.store.pipe(select(selectedLeague), take(1)).subscribe((league: League) => {
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

  save() {
    const roles: { role: string; spots: any }[] = [];
    Object.keys(this.form.controls).forEach((key) => {
      roles.push({ role: key, spots: this.form.controls[key].value });
    });

    this.store.dispatch(LeagueActions.editRoles({ roles }));
  }
}

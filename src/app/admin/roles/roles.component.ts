import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { League } from '@app/models/league';
import { AuthService } from '@app/services/auth.service';
import { NewSeasonService } from '@app/services/new-season.service';
import { toastType } from '@app/shared/globals';
import { SharedService } from '@app/shared/shared.service';
import { switchMap, tap } from 'rxjs/operators';
import { LeagueService } from '@app/services/league.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
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
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('RolesComponent');
    const league = this.leagueService.getSelectedLeague();
    for (const role of league.roles) {
      this.form.get(role.role).setValue(role.spots);
    }
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
    Object.keys(this.form.controls).forEach(key => {
      roles.push({ role: key, spots: this.form.controls[key].value });
    });

    this.newSeasonService.setRoles(this.leagueService.getSelectedLeague()._id, roles).pipe(
      tap((league: League) => {
        this.leagueService.setSelectedLeague(league);
      }),
      switchMap(() => this.authService.refresh()),
      switchMap(() => this.leagueService.refresh)
    ).subscribe(() => {
      const title = 'Modifica ruoli';
      const message = 'I ruoli della lega sono stati modificati con successo';
      this.sharedService.notifica(toastType.success, title, message);
    });
  }

}

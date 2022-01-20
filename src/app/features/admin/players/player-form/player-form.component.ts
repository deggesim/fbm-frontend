import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { LeagueInfo } from '@app/models/league';
import { Role } from '@app/models/player';
import { RealFixture } from '@app/models/real-fixture';
import { Roster } from '@app/models/roster';
import { Team } from '@app/models/team';
import { RealFixtureService } from '@app/shared/services/real-fixture.service';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'fbm-player-form',
  templateUrl: './player-form.component.html',
})
export class PlayerFormComponent implements OnInit, OnChanges {
  @Input() roster: Roster;
  @Output() salva: EventEmitter<any> = new EventEmitter(true);
  @Output() cancel: EventEmitter<any> = new EventEmitter(true);

  form: FormGroup;

  roles: Role[];
  teams: Team[];
  preparedRealFixtures: RealFixture[];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private realFixtureService: RealFixtureService,
    private store: Store<AppState>
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.roles = [Role.Playmaker, Role.PlayGuardia, Role.Guardia, Role.GuardiaAla, Role.Ala, Role.AlaCentro, Role.Centro];
    this.teams = this.route.snapshot.data['teams'];
    this.realFixtureService.read(true).subscribe((realFixtures: RealFixture[]) => {
      this.preparedRealFixtures = realFixtures;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const roster: Roster = changes['roster'].currentValue;
    if (roster != null) {
      const { name, nationality, number, yearBirth, height, weight, role } = roster.player;
      this.form.patchValue({ name, nationality, number, yearBirth, height, weight, role });
      this.form.get('team').setValue(roster.team);
      this.store.pipe(select(leagueInfo)).subscribe((value: LeagueInfo) => {
        this.form.get('realFixture').setValue(value.nextRealFixture);
      });
    }
  }

  createForm() {
    this.form = this.fb.group({
      name: [undefined, Validators.required],
      nationality: [undefined, Validators.required],
      number: [undefined],
      yearBirth: [undefined],
      height: [undefined],
      weight: [undefined],
      role: [undefined, Validators.required],
      team: [undefined, Validators.required],
      realFixture: [undefined, Validators.required],
    });
  }

  salvaGiocatore(): void {
    const { name, nationality, number, yearBirth, height, weight, role } = this.form.value;
    let roster: Roster;
    if (this.roster && this.roster.player) {
      const player = { _id: this.roster.player._id, name, nationality, number, yearBirth, height, weight, role };
      roster = { _id: this.roster._id, player, team: this.form.value.team, realFixture: this.roster.realFixture };
    } else {
      const player = { name, nationality, number, yearBirth, height, weight, role };
      roster = { player, team: this.form.value.team, realFixture: this.form.value.realFixture };
    }
    this.salva.emit(roster);
  }
}

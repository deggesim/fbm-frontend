import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '@app/models/player';
import { RealFixture } from '@app/models/real-fixture';
import { Roster } from '@app/models/roster';
import { Team } from '@app/models/team';
import { LeagueService } from '@app/services/league.service';
import { RealFixtureService } from '@app/services/real-fixture.service';
import { TeamService } from '@app/services/team.service';

@Component({
  selector: 'app-player-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnChanges {

  @Input() roster: Roster;
  @Output() salva: EventEmitter<any> = new EventEmitter(true);
  @Output() annulla: EventEmitter<any> = new EventEmitter(true);

  form: FormGroup;

  roles: Role[];
  teams: Team[];
  preparedRealFixtures: RealFixture[];

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private leagueService: LeagueService,
    private realFixtureService: RealFixtureService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('EditComponent');
    this.roles = [Role.Playmaker, Role.PlayGuardia, Role.Guardia, Role.GuardiaAla, Role.Ala, Role.AlaCentro, Role.Centro];
    this.teamService.read().subscribe((teams: Team[]) => {
      this.teams = teams;
    });
    this.realFixtureService.read(true).subscribe((realFixtures: RealFixture[]) => {
      this.preparedRealFixtures = realFixtures;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const roster: Roster = changes.roster.currentValue;
    if (roster != null) {
      // tslint:disable-next-line: variable-name
      const { name, nationality, number, yearBirth, height, weight, role } = roster.player;
      this.form.patchValue({ name, nationality, number, yearBirth, height, weight, role });
      this.form.get('team').setValue(roster.team);
      this.leagueService.nextRealFixture().subscribe((realFixture: RealFixture) => {
        this.form.get('realFixture').setValue(realFixture);
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
    // tslint:disable-next-line: variable-name
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

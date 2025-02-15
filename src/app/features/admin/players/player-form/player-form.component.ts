import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LeagueInfo } from '@app/models/league';
import { Role } from '@app/models/player';
import { RealFixture } from '@app/models/real-fixture';
import { Roster } from '@app/models/roster';
import { Team } from '@app/models/team';
import { RealFixtureService } from '@app/shared/services/real-fixture.service';

@Component({
  selector: 'fbm-player-form',
  templateUrl: './player-form.component.html',
})
export class PlayerFormComponent implements OnInit, OnChanges {
  @Input() roster: Roster;
  @Input() leagueInfo: LeagueInfo;
  @Output() save: EventEmitter<any> = new EventEmitter(true);
  @Output() cancel: EventEmitter<any> = new EventEmitter(true);

  form = this.fb.group({
    name: [null as string, Validators.required],
    nationality: [null as string, Validators.required],
    number: [null as string],
    yearBirth: [null as number],
    height: [null as number],
    weight: [null as number],
    role: [null as string, Validators.required],
    team: [null as Team, Validators.required],
    realFixture: [null as RealFixture, Validators.required],
  });

  roles: Role[];
  teams: Team[];
  preparedRealFixtures: RealFixture[];

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private realFixtureService: RealFixtureService) {}

  ngOnInit() {
    this.roles = [Role.Playmaker, Role.PlayGuardia, Role.Guardia, Role.GuardiaAla, Role.Ala, Role.AlaCentro, Role.Centro];
    this.teams = this.route.snapshot.data['teams'];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const roster: Roster = changes['roster'].currentValue;
    const leagueInfo: LeagueInfo = changes['leagueInfo'].currentValue;
    if (roster != null) {
      const { name, nationality, number, yearBirth, height, weight, role } = roster.player;
      this.form.patchValue({ name, nationality, number, yearBirth, height, weight, role });
      this.form.get('team').setValue(roster.team);
    }
    this.form.get('realFixture').setValue(leagueInfo.nextRealFixture);

    if (!leagueInfo.preSeason) {
      this.realFixtureService.read(true).subscribe((realFixtures: RealFixture[]) => {
        this.preparedRealFixtures = realFixtures;
      });
    }
  }

  onSubmit(): void {
    const { name, nationality, number, yearBirth, height, weight, role } = this.form.value;
    let roster: Roster;
    if (this.roster && this.roster.player) {
      const player = { _id: this.roster.player._id, name, nationality, number, yearBirth, height, weight, role };
      roster = { _id: this.roster._id, player, team: this.form.value.team, realFixture: this.roster.realFixture };
    } else {
      const player = { name, nationality, number, yearBirth, height, weight, role };
      roster = { player, team: this.form.value.team, realFixture: this.form.value.realFixture };
    }
    this.save.emit(roster);
  }
}

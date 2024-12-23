import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Fixture } from '@app/models/fixture';
import { RealFixture } from '@app/models/real-fixture';
import { Team } from '@app/models/team';
import { FixtureService } from '@app/shared/services/fixture.service';
import { TeamService } from '@app/shared/services/team.service';

@Component({
  selector: 'fbm-real-fixture-form',
  templateUrl: './real-fixture-form.component.html',
})
export class RealFixtureFormComponent implements OnInit, OnChanges {
  @Input() realFixture: RealFixture;
  @Output() save: EventEmitter<any> = new EventEmitter(true);
  @Output() cancel: EventEmitter<any> = new EventEmitter(true);

  form = this.fb.group({
    name: [null as string, Validators.required],
    prepared: [null as boolean, [Validators.requiredTrue]],
    fixtures: [null as Fixture[]],
    teamsWithNoGame: [null as Team[]],
  });

  fixtures: Fixture[];
  fixturesLoading = false;
  teamsWithNoGame: Team[];
  teamsWithNoGameLoading = false;

  constructor(private fb: FormBuilder, private teamService: TeamService, private fixtureService: FixtureService) {}

  ngOnInit() {
    this.form.get('prepared').disable();
    this.form.get('fixtures').disable();
    this.fixturesLoading = this.teamsWithNoGameLoading = true;
    this.teamService.read().subscribe((teamsWithNoGame: Team[]) => {
      this.teamsWithNoGame = teamsWithNoGame;
      this.teamsWithNoGameLoading = false;
    });
    this.fixtureService.read().subscribe((fixtures: Fixture[]) => {
      this.fixtures = fixtures;
      this.fixturesLoading = false;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const realFixture: RealFixture = changes['realFixture'].currentValue;
    if (realFixture != null) {
      const { name, prepared, fixtures, teamsWithNoGame } = realFixture;
      this.form.patchValue({
        name,
        prepared,
        fixtures,
        teamsWithNoGame,
      });
    }
  }

  onSubmit(): void {
    const { name, prepared, fixtures, teamsWithNoGame } = this.form.value;
    const realFixture: RealFixture = {
      _id: this.realFixture ? this.realFixture._id : null,
      name,
      prepared,
      fixtures,
      teamsWithNoGame,
    };
    this.save.emit(realFixture);
  }

  trackFixtureByFn(fixture: Fixture) {
    return fixture._id;
  }

  trackTeamByFn(team: Team) {
    return team._id;
  }
}

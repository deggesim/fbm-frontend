import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RealFixture } from '@app/models/real-fixture';
import { Team } from '@app/models/team';
import { TeamService } from '@app/services/team.service';
import { Fixture } from '@app/models/fixture';
import { FixtureService } from '@app/services/fixture.service';

@Component({
  selector: 'app-real-fixture-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnChanges {

  @Input() realFixture: RealFixture;
  @Output() salva: EventEmitter<any> = new EventEmitter(true);
  @Output() annulla: EventEmitter<any> = new EventEmitter(true);

  form: FormGroup;

  fixtures: Fixture[];
  fixturesLoading = false;
  teamsWithNoGame: Team[];
  teamsWithNoGameLoading = false;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private fixtureService: FixtureService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('EditComponent');
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
    const realFixture: RealFixture = changes.realFixture.currentValue;
    if (realFixture != null) {
      const {
        name,
        prepared,
        fixtures,
        teamsWithNoGame,
      } = realFixture;
      this.form.patchValue({
        name,
        prepared,
        fixtures,
        teamsWithNoGame,
      });
    }
  }

  createForm() {
    this.form = this.fb.group({
      name: [undefined, Validators.required],
      prepared: [undefined, [Validators.requiredTrue]],
      fixtures: [undefined],
      teamsWithNoGame: [undefined],
    });
    this.form.get('prepared').disable();
    this.form.get('fixtures').disable();
  }

  salvaEvent(): void {
    const {
      name,
      prepared,
      fixtures,
      teamsWithNoGame,
    } = this.form.value;
    const realFixture: RealFixture = {
      _id: this.realFixture ? this.realFixture._id : null,
      name,
      prepared,
      fixtures,
      teamsWithNoGame,
    };
    this.salva.emit(realFixture);
  }

  trackFixtureByFn(fixture: Fixture) {
    return fixture._id;
  }

  trackTeamByFn(team: Team) {
    return team._id;
  }

}

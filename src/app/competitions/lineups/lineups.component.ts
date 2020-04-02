import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FantasyRoster } from 'src/app/models/fantasy-roster';
import { FantasyTeam } from 'src/app/models/fantasy-team';
import { Fixture } from 'src/app/models/fixture';
import { Lineup } from 'src/app/models/lineup';
import { RealFixture } from 'src/app/models/real-fixture';
import { Round } from 'src/app/models/round';
import { FantasyRosterService } from 'src/app/services/fantasy-roster.service';
import { RealFixtureService } from 'src/app/services/real-fixture.service';
import { SharedService } from 'src/app/shared/shared.service';
import * as globals from '../../shared/globals';

@Component({
  selector: 'app-lineups',
  templateUrl: './lineups.component.html',
  styleUrls: ['./lineups.component.scss']
})
export class LineupsComponent implements OnInit {

  form: FormGroup;

  rounds: Round[];
  fixtures: Fixture[];
  realFixture: RealFixture;
  fantasyTeams: FantasyTeam[];
  fantasyRosters: FantasyRoster[];
  lineup: Lineup[] = [null, null, null, null, null, null, null, null, null, null, null, null];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private realFixtureService: RealFixtureService,
    private fantasyRosterService: FantasyRosterService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('init LineupsComponent');
    this.route.data.subscribe(
      (data) => {
        this.rounds = data.rounds;
      }
    );
  }

  createForm() {
    this.form = this.fb.group({
      round: [undefined, Validators.required],
      fixture: [undefined, Validators.required],
      fantasyTeam: [undefined, Validators.required],
      lineup: [undefined, [Validators.required, this.lineupValidator]],
    });
    this.form.get('fixture').disable();
    this.form.get('fantasyTeam').disable();
  }

  lineupValidator = (control: AbstractControl) => {
    // tslint:disable-next-line: prefer-const
    let lineupInvalid = false;
    // TODO controllo formazione
    if (lineupInvalid) {
      return { lineupInvalid: true };
    }
    return null;
  }

  onChangeRound(round: Round) {
    this.form.get('fixture').reset();
    this.form.get('fantasyTeam').reset();
    this.fantasyRosters = null;
    this.form.get('lineup').reset();
    if (round != null) {
      if (round.fixtures != null && round.fixtures.length > 0) {
        this.fixtures = round.fixtures;
      }
      if (round.fantasyTeams != null && round.fantasyTeams.length > 0) {
        this.fantasyTeams = round.fantasyTeams;
      }
      this.form.get('fixture').enable();
      this.form.get('fantasyTeam').enable();
    } else {
      this.form.get('fixture').disable();
      this.form.get('fantasyTeam').disable();
    }
  }

  onChangeFixture(fixture: Fixture) {
    this.form.get('fantasyTeam').reset();
    this.fantasyRosters = null;
    if (fixture != null) {
      this.form.get('fantasyTeam').enable();
    } else {
      this.form.get('fantasyTeam').disable();
    }
  }

  onChangeFantasyTeam(fantasyTeam: FantasyTeam) {
    if (fantasyTeam != null) {
      this.realFixtureService.getByFixture(this.form.value.fixture._id).pipe(
        switchMap((realFixture: RealFixture) => this.fantasyRosterService.read(fantasyTeam._id, realFixture._id))
      ).subscribe((fantasyRosters: FantasyRoster[]) => {
        this.fantasyRosters = fantasyRosters;
        console.log(this.fantasyRosters);
      });
    }
  }

  addPlayer(fantasyRoster: FantasyRoster) {
    const playerFound = this.lineup.find((player: Lineup) => {
      if (player != null) {
        return player.fantasyRoster._id === fantasyRoster._id;
      }
    });
    if (playerFound == null) {
      // find first hole
      let index = this.lineup.indexOf(null);
      index = index === -1 ? this.lineup.length : index;
      const benchOrder = index > 4 ? index + 1 - 5 : null;
      const newPlayer: Lineup = {
        fantasyRoster,
        spot: index + 1,
        benchOrder,
        fixture: this.form.value.fixture
      };
      this.lineup[index] = newPlayer;
    }
    this.form.get('lineup').setValue(this.lineup);
  }

  removePlayer(index: number) {
    this.lineup[index] = null;
    this.form.get('lineup').setValue(this.lineup);
  }

  playerChoosen(fantasyRoster: FantasyRoster): boolean {
    const found = this.lineup.find((player: Lineup) => {
      if (player != null) {
        return player.fantasyRoster._id === fantasyRoster._id;
      }
    });
    return found != null;
  }

  reset() {
    this.form.reset();
    this.fixtures = null;
    this.fantasyTeams = null;
    this.fantasyRosters = null;
    this.lineup = null;
  }

  salva() {
    // TODO
    const title = 'Formazione salvata';
    const message = 'La formazione è stata salvata correttamente';
    this.sharedService.notifica(globals.toastType.success, title, message);
  }

  ripristina() {
    console.log('ripristina');
  }

  svuota() {
    console.log('svuota');
  }

  importa() {
    console.log('importa');
  }

  inviaEmail() {
    console.log('inviaEmail');
  }
}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FantasyRoster, PlayerStatus } from 'src/app/models/fantasy-roster';
import { FantasyTeam } from 'src/app/models/fantasy-team';
import { Fixture } from 'src/app/models/fixture';
import { Lineup } from 'src/app/models/lineup';
import { RealFixture } from 'src/app/models/real-fixture';
import { Round } from 'src/app/models/round';
import { FantasyRosterService } from 'src/app/services/fantasy-roster.service';
import { RealFixtureService } from 'src/app/services/real-fixture.service';
import { SharedService } from 'src/app/shared/shared.service';
import { isEmpty, toastType } from '../../shared/globals';
import { lineUpValid, count } from 'src/app/util/lineup';
import { AuthService } from 'src/app/services/auth.service';

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
    private authService: AuthService,
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
    const lineup: Lineup[] = control.value;
    const lineupValid = lineUpValid(lineup, this.authService.getSelectedLeague());
    if (!lineupValid) {
      return { lineupInvalid: true };
    }

    // count EXT, COM, STR, ITA
    const MAX_EXT_OPT_345 = this.authService.getSelectedLeague().parameters.find(param => param.parameter === 'MAX_EXT_OPT_345');
    if (count(lineup, PlayerStatus.Ext) > MAX_EXT_OPT_345.value) {
      return { lineupInvalid: true };
    }
    const MAX_STRANGERS_OPT_55 = this.authService.getSelectedLeague().parameters.find(param => param.parameter === 'MAX_STRANGERS_OPT_55');
    if ((count(lineup, PlayerStatus.Ext) + count(lineup, PlayerStatus.Com)) > MAX_STRANGERS_OPT_55.value) {
      return { lineupInvalid: true };
    }
    // TODO
    // const MAX_STR = this.authService.getSelectedLeague().parameters.find(param => param.parameter === 'MAX_STR');
    // if (count(lineup, PlayerStatus.Str) > MAX_STR.value) {
    //   return { lineupInvalid: true };
    // }
    const MIN_NAT_PLAYERS = this.authService.getSelectedLeague().parameters.find(param => param.parameter === 'MIN_NAT_PLAYERS');
    if (count(lineup, PlayerStatus.Ita) < MIN_NAT_PLAYERS.value) {
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
      if (round.fixtures != null && !isEmpty(round.fixtures)) {
        this.fixtures = round.fixtures;
      }
      if (round.fantasyTeams != null && !isEmpty(round.fantasyTeams)) {
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
    this.form.get('lineup').markAsDirty();
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

  openModalBenchOrder() {
    console.log('openModalBenchOrder');
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
    this.sharedService.notifica(toastType.success, title, message);
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

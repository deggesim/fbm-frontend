import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FantasyRoster, PlayerStatus } from '@app/models/fantasy-roster';
import { FantasyTeam } from '@app/models/fantasy-team';
import { Fixture } from '@app/models/fixture';
import { Lineup } from '@app/models/lineup';
import { RealFixture } from '@app/models/real-fixture';
import { Round } from '@app/models/round';
import { FantasyRosterService } from '@app/services/fantasy-roster.service';
import { LeagueService } from '@app/services/league.service';
import { LineupService } from '@app/services/lineup.service';
import { RealFixtureService } from '@app/services/real-fixture.service';
import { AppConfig, isEmpty, toastType } from '@app/shared/globals';
import { SharedService } from '@app/shared/shared.service';
import { count, lineUpValid } from '@app/util/lineup';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-lineups',
  templateUrl: './lineups.component.html',
  styleUrls: ['./lineups.component.scss']
})
export class LineupsComponent implements OnInit {

  form: FormGroup;
  benchForm: FormGroup;
  benchPlayers: Lineup[];
  mostraPopupPanchina: boolean;

  rounds: Round[];
  fixtures: Fixture[];
  fantasyTeams: FantasyTeam[];
  fantasyRosters: FantasyRoster[];
  fantasyRostersPresent = false;
  allFieldsSelected = false;
  lineup: Lineup[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private leagueService: LeagueService,
    private sharedService: SharedService,
    private realFixtureService: RealFixtureService,
    private fantasyRosterService: FantasyRosterService,
    private lineupService: LineupService,
  ) {
    this.createForm();
    this.createBenchForm();
    this.lineup = this.initLineup();
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

  createBenchForm() {
    this.benchForm = this.fb.group({
      sortedList: [undefined],
    });
  }

  lineupValidator = (control: AbstractControl) => {
    const lineup: Lineup[] = control.value;
    const lineupValid = lineUpValid(lineup, this.leagueService.getSelectedLeague());
    if (!lineupValid) {
      return { lineupInvalid: true };
    }

    // count EXT, COM, STR, ITA
    const MAX_EXT_OPT_345 = this.leagueService.getSelectedLeague().parameters.find(param => param.parameter === 'MAX_EXT_OPT_345');
    if (count(lineup, PlayerStatus.Ext) > MAX_EXT_OPT_345.value) {
      return { lineupInvalid: true };
    }
    const MAX_STRANGERS_OPT_55 =
      this.leagueService.getSelectedLeague().parameters.find(param => param.parameter === 'MAX_STRANGERS_OPT_55');
    if ((count(lineup, PlayerStatus.Ext) + count(lineup, PlayerStatus.Com)) > MAX_STRANGERS_OPT_55.value) {
      return { lineupInvalid: true };
    }
    // TODO
    // const MAX_STR = this.authService.getSelectedLeague().parameters.find(param => param.parameter === 'MAX_STR');
    // if (count(lineup, PlayerStatus.Str) > MAX_STR.value) {
    //   return { lineupInvalid: true };
    // }
    const MIN_NAT_PLAYERS = this.leagueService.getSelectedLeague().parameters.find(param => param.parameter === 'MIN_NAT_PLAYERS');
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
    this.lineup = this.initLineup();
    this.fantasyRostersPresent = false;
    this.allFieldsSelected = false;
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
    this.form.get('lineup').reset();
    this.lineup = this.initLineup();
    this.fantasyRostersPresent = false;
    this.allFieldsSelected = false;
    if (fixture != null) {
      this.form.get('fantasyTeam').enable();
    } else {
      this.form.get('fantasyTeam').disable();
    }
  }

  onChangeFantasyTeam(fantasyTeam: FantasyTeam) {
    if (fantasyTeam != null) {
      this.realFixtureService.getByFixture(this.form.value.fixture._id).pipe(
        switchMap((realFixture: RealFixture) => this.fantasyRosterService.read(fantasyTeam._id, realFixture._id)),
        tap((fantasyRosters: FantasyRoster[]) => {
          this.fantasyRostersPresent = fantasyRosters != null && !isEmpty(fantasyRosters);
          this.allFieldsSelected = true;
          if (this.fantasyRostersPresent) {
            this.fantasyRosters = fantasyRosters;
            this.lineup = this.initLineup();
          }
        }),
        switchMap(() => this.lineupService.lineupByTeam(fantasyTeam._id, this.form.value.fixture._id)),
      ).subscribe((lineup: Lineup[]) => {
        this.form.get('lineup').reset();
        this.lineup = this.initLineup();
        if (lineup != null && !isEmpty(lineup)) {
          this.lineup = lineup;
          this.form.get('lineup').setValue(this.lineup);
          this.form.get('lineup').markAsDirty();
        }
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
      const benchOrder = (index > AppConfig.Starters - 1 && index < AppConfig.MinPlayersInLineup) ? index + 1 - AppConfig.Starters : null;
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
    this.form.get('lineup').markAsDirty();
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
    this.benchPlayers = this.lineup.filter(player => player != null && player.benchOrder != null);
    this.benchForm.get('sortedList').setValue(this.benchPlayers);
    this.mostraPopupPanchina = true;
  }

  salvaPanchina() {
    const newOrder: Lineup[] = this.benchForm.value.sortedList;
    let i = 1;
    for (const player of newOrder) {
      player.benchOrder = i++;
    }
    newOrder.sort((a: Lineup, b: Lineup) => a.spot - b.spot);
    this.lineup.splice(AppConfig.FirstBenchPlayerIndex, AppConfig.PlayersInBench, ...newOrder);
    this.form.get('lineup').setValue(this.lineup);
    this.mostraPopupPanchina = false;
  }

  annulla(): void {
    this.mostraPopupPanchina = false;
  }

  reset() {
    this.form.reset();
    this.fixtures = null;
    this.fantasyTeams = null;
    this.fantasyRosters = null;
    this.lineup = null;
  }

  salva() {
    const filteredLineup = this.lineup.filter(lineup => lineup != null);
    this.lineupService.save(this.form.value.fantasyTeam._id, this.form.value.fixture._id, filteredLineup).subscribe(() => {
      const title = 'Formazione salvata';
      const message = 'La formazione è stata salvata correttamente';
      this.sharedService.notifica(toastType.success, title, message);
    });
  }

  ripristina() {
    this.lineupService.lineupByTeam(this.form.value.fantasyTeam._id, this.form.value.fixture._id).subscribe((lineup: Lineup[]) => {
      if (lineup != null && !isEmpty(lineup)) {
        this.lineup = lineup.map((player: Lineup) => {
          return {
            fantasyRoster: player.fantasyRoster,
            spot: player.spot,
            benchOrder: player.benchOrder,
            fixture: player.fixture
          };
        });
        this.form.get('lineup').markAsPristine();
        const title = 'Formazione ripristinata';
        const message = 'La formazione è stata ripristinata correttamente';
        this.sharedService.notifica(toastType.success, title, message);
      }
    });
  }

  svuota() {
    this.lineupService.delete(this.form.value.fantasyTeam._id, this.form.value.fixture._id).subscribe(() => {
      this.lineup = this.initLineup();
      this.form.get('lineup').markAsPristine();
      const title = 'Formazione eliminata';
      const message = 'La formazione è stata eliminata correttamente';
      this.sharedService.notifica(toastType.success, title, message);
    });
  }

  importa() {
    console.log('importa');
  }

  inviaEmail() {
    console.log('inviaEmail');
  }

  private initLineup(): Lineup[] {
    const initLineup: Lineup[] = [];
    for (let i = 0; i < AppConfig.MaxPlayersInLineup; i++) {
      initLineup.push(null);
    }
    return initLineup;
  }
}

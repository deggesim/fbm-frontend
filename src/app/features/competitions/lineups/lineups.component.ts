import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { leagueInfo, selectedLeague } from '@app/core/league/store/league.selector';
import { SpinnerService } from '@app/core/spinner.service';
import { UserService } from '@app/core/user/services/user.service';
import { user } from '@app/core/user/store/user.selector';
import { FantasyRoster, PlayerStatus } from '@app/models/fantasy-roster';
import { FantasyTeam } from '@app/models/fantasy-team';
import { Fixture } from '@app/models/fixture';
import { League, LeagueInfo } from '@app/models/league';
import { Lineup } from '@app/models/lineup';
import { Match } from '@app/models/match';
import { Performance } from '@app/models/performance';
import { PlayerStats } from '@app/models/player-stats';
import { RealFixture } from '@app/models/real-fixture';
import { Round } from '@app/models/round';
import { User } from '@app/models/user';
import { AppConfig } from '@app/shared/constants/globals';
import { FantasyRosterService } from '@app/shared/services/fantasy-roster.service';
import { LineupService } from '@app/shared/services/lineup.service';
import { PerformanceService } from '@app/shared/services/performance.service';
import { RealFixtureService } from '@app/shared/services/real-fixture.service';
import { ToastService } from '@app/shared/services/toast.service';
import { count, lineUpValid } from '@app/shared/util/lineup';
import { statistics } from '@app/shared/util/statistics';
import { select, Store } from '@ngrx/store';
import { isEmpty } from 'lodash-es';
import { DateTime } from 'luxon';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { EMPTY, forkJoin, iif, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'fbm-lineups',
  templateUrl: './lineups.component.html',
  styleUrls: ['./lineups.component.scss'],
})
export class LineupsComponent implements OnInit {
  lineupValidator = (control: AbstractControl) => {
    const lineup: Lineup[] = control.value;

    const lineupValid = lineUpValid(lineup, this.selectedLeague);
    if (!lineupValid) {
      return { lineupInvalid: true };
    }

    // count EXT, COM, STR, ITA
    const MAX_STR = this.selectedLeague.parameters.find((param) => param.parameter === 'MAX_STR');
    if (MAX_STR) {
      const totalStr = count(lineup, PlayerStatus.Str) || count(lineup, PlayerStatus.Ext) + count(lineup, PlayerStatus.Com);
      if (totalStr > MAX_STR.value) {
        return { lineupInvalid: true };
      }

      if (count(lineup, PlayerStatus.Ita) < totalStr) {
        return { lineupInvalid: true };
      }
    } else {
      const MAX_EXT_OPT_345 = this.selectedLeague.parameters.find((param) => param.parameter === 'MAX_EXT_OPT_345');
      if (count(lineup, PlayerStatus.Ext) > MAX_EXT_OPT_345.value) {
        return { lineupInvalid: true };
      }

      const MAX_STRANGERS_OPT_55 = this.selectedLeague.parameters.find((param) => param.parameter === 'MAX_STRANGERS_OPT_55');
      if (count(lineup, PlayerStatus.Ext) + count(lineup, PlayerStatus.Com) > MAX_STRANGERS_OPT_55.value) {
        return { lineupInvalid: true };
      }

      const MIN_NAT_PLAYERS = this.selectedLeague.parameters.find((param) => param.parameter === 'MIN_NAT_PLAYERS');
      if (count(lineup, PlayerStatus.Ita) < MIN_NAT_PLAYERS.value) {
        return { lineupInvalid: true };
      }
    }

    return null;
  };

  form = this.fb.group({
    round: [null as Round, Validators.required],
    fixture: [null as Fixture, Validators.required],
    fantasyTeam: [null as FantasyTeam, Validators.required],
    lineup: [null as Lineup[], [Validators.required, this.lineupValidator]],
  });

  benchForm = this.fb.group({
    sortedList: [null as Lineup[]],
  });

  rounds: Round[];
  fixtures: Fixture[];
  fantasyTeams: FantasyTeam[];
  fantasyRosters: FantasyRoster[];
  fantasyRostersPresent = false;
  allFieldsSelected = false;
  lineup: Lineup[];
  changeAllowed = false;
  tooltip = new Map<string, PlayerStats>();
  selectedRound: Round;
  selectedRealFixture: RealFixture;
  selectedFantasyTeam: FantasyTeam;
  selectedFixture: Fixture;

  isAdmin: boolean;
  user: User;
  selectedLeague: League;
  nextRealFixture: RealFixture;

  disableCopyLineup = true;

  @ViewChild('modalBenchForm', { static: false }) modalBenchForm: ModalDirective;
  showModalBenchForm: boolean;

  private route: ActivatedRoute;
  private toastService: ToastService;
  private userService: UserService;
  private realFixtureService: RealFixtureService;
  private fantasyRosterService: FantasyRosterService;
  private lineupService: LineupService;
  private performanceService: PerformanceService;
  private store: Store<AppState>;
  private clipboard: Clipboard;
  private spinnerService: SpinnerService;

  constructor(injector: Injector, private fb: FormBuilder) {
    this.route = injector.get(ActivatedRoute);
    this.toastService = injector.get(ToastService);
    this.userService = injector.get(UserService);
    this.realFixtureService = injector.get(RealFixtureService);
    this.fantasyRosterService = injector.get(FantasyRosterService);
    this.lineupService = injector.get(LineupService);
    this.performanceService = injector.get(PerformanceService);
    this.store = injector.get(Store);
    this.clipboard = injector.get(Clipboard);
    this.spinnerService = injector.get(SpinnerService);

    this.lineup = this.initLineup();
  }

  ngOnInit() {
    this.rounds = this.route.snapshot.data['rounds'];
    this.store.pipe(select(user), take(1)).subscribe((value: User) => {
      this.user = value;
    });
    this.store.pipe(select(selectedLeague), take(1)).subscribe((value: League) => {
      this.selectedLeague = value;
    });
    this.userService
      .isAdmin$()
      .pipe(take(1))
      .subscribe((value: boolean) => {
        this.isAdmin = value;
      });
    this.store.pipe(select(leagueInfo), take(1)).subscribe((value: LeagueInfo) => {
      this.nextRealFixture = value.nextRealFixture;
    });

    const round = this.route.snapshot.queryParams['round'];
    const fixture = this.route.snapshot.queryParams['fixture'];
    const fantasyTeam = this.route.snapshot.queryParams['fantasyTeam'];

    if (round && fixture && fantasyTeam) {
      const selectedRound = this.rounds.find((value: Round) => value._id === round);
      if (selectedRound) {
        this.fixtures = selectedRound.fixtures;
        this.fantasyTeams = selectedRound.fantasyTeams;
        const selectedFixture = this.fixtures?.find((value: Fixture) => value._id === fixture);
        const selectedFantasyTeam = this.fantasyTeams?.find((value: FantasyTeam) => value._id === fantasyTeam);
        this.form.patchValue({
          round: selectedRound,
          fixture: selectedFixture,
          fantasyTeam: selectedFantasyTeam,
        });
        if (selectedFixture && selectedFantasyTeam) {
          this.form.get('fixture').enable();
          this.form.get('fantasyTeam').enable();
          this.onChangeFantasyTeam(selectedFantasyTeam);
        }
      }
    }
  }

  onChangeRound(round: Round) {
    this.selectedRound = round;
    this.form.get('fixture').reset();
    this.form.get('fantasyTeam').reset();
    this.changeAllowed = false;
    this.disableCopyLineup = true;
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
    this.selectedFixture = fixture;
    this.form.get('fantasyTeam').reset();
    this.changeAllowed = false;
    this.disableCopyLineup = true;
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
    this.selectedFantasyTeam = fantasyTeam;
    this.disableCopyLineup = true;
    if (fantasyTeam != null) {
      const teamManagedByLoggedUser = fantasyTeam.owners.find((owner) => owner._id === this.user._id) != null;
      this.changeAllowed = this.isAdmin || teamManagedByLoggedUser;
      this.realFixtureService
        .getByFixture(this.form.value.fixture._id)
        .pipe(
          tap((realFixture: RealFixture) => {
            this.selectedRealFixture = realFixture;
          }),
          switchMap((realFixture: RealFixture) => this.fantasyRosterService.read(fantasyTeam._id, realFixture._id)),
          tap((fantasyRosters: FantasyRoster[]) => {
            this.fantasyRostersPresent = fantasyRosters != null && !isEmpty(fantasyRosters);
            this.allFieldsSelected = true;
            if (this.fantasyRostersPresent) {
              this.fantasyRosters = fantasyRosters;
              this.lineup = this.initLineup();
            }
          }),
          switchMap((fantasyRosters: FantasyRoster[]) => this.buildStatistics(fantasyRosters)),
          switchMap(() => this.lineupService.lineupByTeam(fantasyTeam._id, this.form.value.fixture._id))
        )
        .subscribe((lineup: Lineup[]) => {
          this.form.get('lineup').reset();
          this.lineup = this.initLineup();
          if (lineup != null && !isEmpty(lineup)) {
            this.lineup = lineup;
            this.form.get('lineup').setValue(this.lineup);
            this.form.get('lineup').markAsDirty();
            this.disableCopyLineup = false;
          }
        });
    }
  }

  addPlayer(fantasyRoster: FantasyRoster) {
    if (this.changeAllowed) {
      this.disableCopyLineup = true;
      this.form.get('lineup').markAsDirty();
      const playerFound = this.findPlayer(fantasyRoster);
      if (playerFound == null) {
        // find first hole
        let index = this.lineup.indexOf(null);
        index = index === -1 ? this.lineup.length : index;

        // check cardinality
        if (index > 11) {
          this.toastService.warning('Attenzione', 'Non puoi inserire ulteriori giocatori');
          return;
        }

        const benchOrder = index > AppConfig.Starters - 1 && index < AppConfig.MinPlayersInLineup ? index + 1 - AppConfig.Starters : null;
        const newPlayer: Lineup = {
          fantasyRoster,
          spot: index + 1,
          benchOrder,
          fixture: this.form.value.fixture,
        };
        this.lineup[index] = newPlayer;
      }
      this.form.get('lineup').setValue(this.lineup);
    }
  }

  removePlayer(index: number) {
    if (this.changeAllowed) {
      this.disableCopyLineup = true;
      this.form.get('lineup').markAsDirty();
      this.lineup[index] = null;
      if (index > AppConfig.Starters - 1 && index < AppConfig.MinPlayersInLineup) {
        for (let i = AppConfig.FirstBenchPlayerIndex; i <= AppConfig.LastBenchPlayerIndex; i++) {
          const benchPlayer = this.lineup[i];
          if (benchPlayer) {
            benchPlayer.benchOrder = i + 1 - AppConfig.Starters;
          }
        }
      }
      this.form.get('lineup').setValue(this.lineup);
    }
  }

  buildStatistics(fantasyRosters: FantasyRoster[]): Observable<PlayerStats[]> {
    const obs: Observable<PlayerStats>[] = [];
    for (const fr of fantasyRosters) {
      obs.push(this.loadPlayerStatistics(fr));
    }
    return forkJoin(obs);
  }

  private loadPlayerStatistics(fantasyRoster: FantasyRoster) {
    return this.performanceService.getPerformances(fantasyRoster.roster.player._id).pipe(
      map((performances: Performance[]) => {
        return performances
          .filter((value) => value.realFixture.prepared && value.realFixture._id !== this.nextRealFixture._id)
          .sort((a, b) => a.realFixture.order - b.realFixture.order);
      }),
      map((performances: Performance[]) => statistics(fantasyRoster.roster.player, performances, this.nextRealFixture, 5)),
      tap((playerStats: PlayerStats) => {
        this.tooltip.set(fantasyRoster.roster.player._id, playerStats);
      })
    );
  }

  playerChoosen(fantasyRoster: FantasyRoster): boolean {
    const playerFound = this.findPlayer(fantasyRoster);
    return playerFound != null;
  }

  openModalBenchOrder() {
    const benchPlayers = this.lineup.filter((player) => player != null && player.benchOrder != null);
    this.benchForm.get('sortedList').setValue([...benchPlayers].sort((b1, b2) => b1.benchOrder - b2.benchOrder));
    this.showModalBenchForm = true;
  }

  onSubmitBenchForm() {
    this.hideModal();
    const newOrder: Lineup[] = this.benchForm.value.sortedList;
    let i = 1;
    for (const player of newOrder) {
      player.benchOrder = i++;
    }
    newOrder.sort((a: Lineup, b: Lineup) => a.spot - b.spot);
    this.lineup.splice(AppConfig.FirstBenchPlayerIndex, AppConfig.PlayersInBench, ...newOrder);
    this.form.get('lineup').setValue(this.lineup);
  }

  movePlayerUp(index: number) {
    const newOrder = this.move(this.benchForm.value.sortedList, index, index - 1);
    this.benchForm.get('sortedList').setValue(newOrder);
  }

  movePlayerDown(index: number) {
    const newOrder = this.move(this.benchForm.value.sortedList, index, index + 1);
    this.benchForm.get('sortedList').setValue(newOrder);
  }

  private move = (arr: Lineup[], prevIndex: number, newIndex: number): Lineup[] => {
    let newArr = [...arr];
    if (newIndex >= newArr.length) {
      let k = newIndex - newArr.length + 1;
      while (k--) {
        newArr.push(undefined);
      }
    }
    newArr.splice(newIndex, 0, newArr.splice(prevIndex, 1)[0]);
    return newArr;
  };

  hideModal(): void {
    this.modalBenchForm?.hide();
  }

  onHidden(): void {
    this.showModalBenchForm = false;
  }

  reset() {
    this.form.reset();
    this.fixtures = null;
    this.fantasyTeams = null;
    this.fantasyRosters = null;
    this.lineup = null;
    this.disableCopyLineup = true;
  }

  save() {
    const filteredLineup = this.lineup.filter((lineup) => lineup != null);
    this.lineupService.save(this.form.value.fantasyTeam._id, this.form.value.fixture._id, filteredLineup).subscribe(() => {
      this.toastService.success('Formazione salvata', 'La formazione è stata salvata correttamente');
      this.disableCopyLineup = false;
    });
  }

  restore() {
    this.lineupService.lineupByTeam(this.form.value.fantasyTeam._id, this.form.value.fixture._id).subscribe((lineup: Lineup[]) => {
      if (lineup != null && !isEmpty(lineup)) {
        this.lineup = lineup.map((player: Lineup) => {
          return {
            fantasyRoster: player.fantasyRoster,
            spot: player.spot,
            benchOrder: player.benchOrder,
            fixture: player.fixture,
          };
        });
        this.form.get('lineup').markAsPristine();
        this.toastService.success('Formazione ripristinata', 'La formazione è stata ripristinata correttamente');
        this.disableCopyLineup = false;
      }
    });
  }

  empty() {
    this.lineupService.delete(this.form.value.fantasyTeam._id, this.form.value.fixture._id).subscribe(() => {
      this.lineup = this.initLineup();
      this.form.get('lineup').markAsPristine();
      this.toastService.success('Formazione eliminata', 'La formazione è stata eliminata correttamente');
      this.disableCopyLineup = true;
    });
  }

  import() {
    let prevRealFixutre: RealFixture;
    let prevFixture: Fixture;
    this.realFixtureService
      .read(true)
      .pipe(
        switchMap((realFixtures: RealFixture[]) => {
          const orderedRealFixtures = [...realFixtures].sort((a: RealFixture, b: RealFixture) => a.order - b.order);
          const index = orderedRealFixtures.map((f) => f._id).indexOf(this.selectedRealFixture._id);
          if (index > 0) {
            prevRealFixutre = orderedRealFixtures[index - 1];
            const orderedFixtures =
              prevRealFixutre.fixtures?.length > 0
                ? [...prevRealFixutre.fixtures]
                    .filter((f: Fixture) => {
                      const matchPlayedBySelectedFantasyTeam = f.matches.find(
                        (m: Match) => m.homeTeam._id === this.selectedFantasyTeam._id || m.awayTeam._id === this.selectedFantasyTeam._id
                      );
                      return matchPlayedBySelectedFantasyTeam != null;
                    })
                    .sort(
                      (f1: Fixture, f2: Fixture) =>
                        DateTime.fromISO(f2.updatedAt as string).diff(DateTime.fromISO(f1.updatedAt as string)).milliseconds
                    )
                : null;
            prevFixture = orderedFixtures?.length > 0 ? orderedFixtures[0] : null;
          }
          return prevFixture ? this.lineupService.lineupByTeam(this.selectedFantasyTeam._id, prevFixture._id) : EMPTY;
        }),
        switchMap((lineup: Lineup[]) => {
          let rosterOk = true;
          if (lineup != null && !isEmpty(lineup)) {
            // verify player still present in this fantasy roster
            for (const player of lineup) {
              if (!this.fantasyRosters.map((fr: FantasyRoster) => fr.roster.player._id).includes(player.fantasyRoster.roster.player._id)) {
                // player not present anymore
                rosterOk = false;
                this.toastService.error('Errore', 'La formazione non può essere importata perché non è compatibile con il roster attuale');
                break;
              }
            }
            if (rosterOk) {
              this.lineup = lineup.map((player: Lineup) => {
                const actualFantasyRoster = this.fantasyRosters.find(
                  (fr: FantasyRoster) => fr.roster.player._id === player.fantasyRoster.roster.player._id
                );
                return {
                  fantasyRoster: actualFantasyRoster,
                  spot: player.spot,
                  benchOrder: player.benchOrder,
                  fixture: this.form.value.fixture,
                };
              });
            }
          }
          return of(rosterOk);
        }),
        switchMap((rosterOk: boolean) =>
          iif(() => rosterOk, this.lineupService.save(this.form.value.fantasyTeam._id, this.form.value.fixture._id, this.lineup), EMPTY)
        )
      )
      .subscribe((lineup: Lineup[]) => {
        if (lineup != null && !isEmpty(lineup)) {
          this.form.get('lineup').markAsPristine();
          this.toastService.success(
            'Formazione importata',
            `La formazione del round ${this.selectedRound.competition.name} - ${this.selectedRound.name}, turno ${prevFixture.name} è stata importata correttamente`
          );
          this.disableCopyLineup = false;
        }
      });
  }

  htmlLineup() {
    const filteredLineup: Lineup[] = this.lineup.filter((lineup) => lineup != null);
    let rows: string[] = [];

    for (let i = 0; i < 5; i++) {
      const lineup = filteredLineup[i];
      const benchePlayer = filteredLineup[i + 5];
      let colorStarter = this.getColor(lineup);
      let colorBenchPlayer = this.getColor(benchePlayer);
      const row = `
      <tr>
        <td>${lineup.spot}</td>
        <td ${colorStarter}" >${lineup.fantasyRoster.roster.player.name} (${lineup.fantasyRoster.roster.player.role}-${lineup.fantasyRoster.status}-${lineup.fantasyRoster.roster.team.abbreviation})</td>
        <td ${colorBenchPlayer}" >${benchePlayer.fantasyRoster.roster.player.name} (${benchePlayer.fantasyRoster.roster.player.role}-${benchePlayer.fantasyRoster.status}-${benchePlayer.fantasyRoster.roster.team.abbreviation}) - ${benchePlayer.benchOrder}</td>
      </tr>`;
      rows.push(row);
    }
    if (filteredLineup[10]) {
      const lineup = filteredLineup[10];
      let color = this.getColor(lineup);
      rows.push(`
      <tr>
        <td>${lineup.spot}</td>
        <td colspan="2" ${color}" >${lineup.fantasyRoster.roster.player.name} (${lineup.fantasyRoster.roster.player.role}-${lineup.fantasyRoster.status}-${lineup.fantasyRoster.roster.team.abbreviation})</td>
      </tr>`);
    }

    if (filteredLineup[11]) {
      const lineup = filteredLineup[11];
      let color = this.getColor(lineup);
      rows.push(`
      <tr>
        <td>${lineup.spot}</td>
        <td colspan="2" ${color}>${lineup.fantasyRoster.roster.player.name} (${lineup.fantasyRoster.roster.player.role}-${lineup.fantasyRoster.status}-${lineup.fantasyRoster.roster.team.abbreviation})</td>
      </tr>`);
    }

    let formazioneForum = `
    <table border="0" cellpadding="4" cellspacing="0" style="font-family: Georgia;font-size: 12px;">
      <thead>
        <tr>
            <th colspan="3" align="center" >${this.form.get('fantasyTeam').value.name}</th>
        </tr>
      </thead>
      <tbody>
        ${rows.join('\n')}
      </tbody>
    </table>
    `;

    this.spinnerService.start();
    const pending = this.clipboard.beginCopy(formazioneForum);
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        // Remember to destroy when you're done!
        pending.destroy();
        this.spinnerService.end();
        this.toastService.success('Formazione copiata', "La formazione è stata copiata. E' possibile incollare direttamente sul forum");
      }
    };
    attempt();
  }

  roundSearchFn = (term: string, round: Round) => {
    return round.name.toLowerCase().includes(term.toLowerCase()) || round.competition?.name.toLowerCase().includes(term.toLowerCase());
  };

  private initLineup(): Lineup[] {
    const initLineup: Lineup[] = [];
    for (let i = 0; i < AppConfig.MaxPlayersInLineup; i++) {
      initLineup.push(null);
    }
    return initLineup;
  }

  private getColor(lineup: Lineup): string {
    let color: string;
    switch (lineup.fantasyRoster.status) {
      case PlayerStatus.Ext:
      case PlayerStatus.Str:
        color = 'style="color:#e74c3c;"';
        break;
      case PlayerStatus.Com:
        color = 'style="color:#f39c12;"';
        break;
      default:
        break;
    }
    return color;
  }

  private findPlayer(fantasyRoster: FantasyRoster) {
    return this.lineup.find((player: Lineup) => (player != null ? player.fantasyRoster._id === fantasyRoster._id : false));
  }
}

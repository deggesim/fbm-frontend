import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { FantasyTeam } from '@app/models/fantasy-team';
import { LeagueInfo } from '@app/models/league';
import { Performance } from '@app/models/performance';
import { Player, Role } from '@app/models/player';
import { PlayerStatisticList } from '@app/models/player-statistics';
import { PlayerStats } from '@app/models/player-stats';
import { RealFixture } from '@app/models/real-fixture';
import { Team } from '@app/models/team';
import { PerformanceService } from '@app/shared/services/performance.service';
import { PlayerStatisticService } from '@app/shared/services/player-statistics.service';
import { select, Store } from '@ngrx/store';
import { isEmpty } from 'lodash-es';
import { forkJoin, iif, Observable, of, zip } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'fbm-top-flop',
  templateUrl: './top-flop.component.html',
})
export class TopFlopComponent implements OnInit {
  roles: Role[];
  teams: Team[];
  fantasyTeams: FantasyTeam[];
  playerStatisticList: PlayerStatisticList;
  nextRealFixture: RealFixture;
  tooltip = new Map<string, PlayerStats>();

  form: UntypedFormGroup;

  // paginazione
  page = 1;
  limit = 10;
  maxSize = 5;
  boundaryLinks = true;

  constructor(
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private store: Store<AppState>,
    private playerStatisticService: PlayerStatisticService,
    private performanceService: PerformanceService
  ) {
    this.createForm();
    this.form.get('freePlayers').valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('fantasyTeam').reset();
        this.form.get('fantasyTeam').disable();
      } else {
        this.form.get('fantasyTeam').enable();
      }
    });
  }

  ngOnInit(): void {
    this.roles = [Role.Playmaker, Role.PlayGuardia, Role.Guardia, Role.GuardiaAla, Role.Ala, Role.AlaCentro, Role.Centro];
    this.teams = this.route.snapshot.data['teams'];
    this.fantasyTeams = this.route.snapshot.data['fantasyTeams'];
    this.store.pipe(select(leagueInfo), take(1)).subscribe((value: LeagueInfo) => {
      this.nextRealFixture = value.nextRealFixture;
    });
    this.loadStatistics();
  }

  createForm() {
    this.form = this.fb.group({
      team: [],
      fantasyTeam: [],
      role: [],
      freePlayers: [],
    });

    this.form.valueChanges.subscribe((value) => {
      const { team, fantasyTeam, role, freePlayers } = value;
      this.page = 1;
      this.loadStatistics(team, fantasyTeam, role, freePlayers);
    });
  }

  enablePagination() {
    return !isEmpty(this.playerStatisticList?.content) && this.playerStatisticList?.totalElements > this.limit;
  }

  pageChange(event: { page: number }) {
    this.page = event.page;
    const { team, fantasyTeam, role, freePlayers } = this.form.value;
    this.loadStatistics(team, fantasyTeam, role, freePlayers);
  }

  buildStatistics(players: Player[]): Observable<PlayerStats[]> {
    const obs: Observable<PlayerStats>[] = [];
    for (const player of players) {
      obs.push(this.loadPlayerStatistics(player));
    }
    return forkJoin(obs);
  }

  reset() {
    this.form.reset();
  }

  private loadStatistics(team?: Team, fantasyTeam?: FantasyTeam, role?: Role, freePlayers?: boolean) {
    this.playerStatisticService
      .read(this.page, this.limit, team, fantasyTeam, role, freePlayers)
      .pipe(
        switchMap((value: PlayerStatisticList) =>
          iif(
            () => value.content && value.content.length > 0,
            zip(of(value), value.content && this.buildStatistics(value.content.map((stat) => stat.player))),
            zip(of(value), of([]))
          )
        )
      )
      .subscribe((value: [PlayerStatisticList, PlayerStats[]]) => {
        this.playerStatisticList = value[0];
      });
  }

  private loadPlayerStatistics(player: Player) {
    return this.performanceService.getPerformances(player._id).pipe(
      map((performances: Performance[]) => {
        return performances
          .filter((value) => value.realFixture.prepared && value.realFixture._id !== this.nextRealFixture._id)
          .sort((a, b) => a.realFixture.order - b.realFixture.order);
      }),
      map((performances: Performance[]) => ({ player, trend: performances })),
      tap((playerStats: PlayerStats) => {
        this.tooltip.set(player._id, playerStats);
      })
    );
  }
}

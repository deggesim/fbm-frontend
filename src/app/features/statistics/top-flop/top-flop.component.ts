import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { leagueInfo } from '@app/core/league/store/league.selector';
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
import { forkJoin, Observable, of, zip } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-top-flop',
  templateUrl: './top-flop.component.html',
})
export class TopFlopComponent implements OnInit {
  roles: Role[];
  teams: Team[];
  playerStatisticList: PlayerStatisticList;
  nextRealFixture: RealFixture;
  tooltip = new Map<string, PlayerStats>();

  form: FormGroup;

  // paginazione
  page = 1;
  limit = 10;
  maxSize = 5;
  boundaryLinks = true;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private playerStatisticService: PlayerStatisticService,
    private performanceService: PerformanceService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.roles = [Role.Playmaker, Role.PlayGuardia, Role.Guardia, Role.GuardiaAla, Role.Ala, Role.AlaCentro, Role.Centro];
    this.teams = this.route.snapshot.data.teams;
    this.store.pipe(select(leagueInfo), take(1)).subscribe((value: LeagueInfo) => {
      this.nextRealFixture = value.nextRealFixture;
    });
    this.playerStatisticService
      .read(this.page, this.limit)
      .pipe(switchMap((value: PlayerStatisticList) => zip(of(value), this.buildStatistics(value.content.map((stat) => stat.player)))))
      .subscribe((value: [PlayerStatisticList, PlayerStats[]]) => {
        this.playerStatisticList = value[0];
      });
  }

  createForm() {
    this.form = this.fb.group({
      team: [],
      role: [],
    });
  }

  abilitaPaginazione() {
    return !isEmpty(this.playerStatisticList?.content) && this.playerStatisticList?.totalElements > this.limit;
  }

  pageChange(event) {
    this.page = event.page;
    this.playerStatisticService.read(this.page, this.limit).subscribe((playerStatisticList: PlayerStatisticList) => {
      this.playerStatisticList = playerStatisticList;
    });
  }

  buildStatistics(players: Player[]): Observable<PlayerStats[]> {
    const obs: Observable<PlayerStats>[] = [];
    for (const player of players) {
      obs.push(this.loadStatistics(player));
    }
    return forkJoin(obs);
  }

  loadStatistics(player: Player) {
    return this.performanceService.getPerformances(player._id).pipe(
      map((performances: Performance[]) => {
        return performances
          .filter((value) => value.realFixture.prepared && value.realFixture._id !== this.nextRealFixture._id)
          .sort((a, b) => a.realFixture._id.localeCompare(b.realFixture._id));
      }),
      map((performances: Performance[]) => ({ player, trend: performances })),
      tap((playerStats: PlayerStats) => {
        this.tooltip.set(player._id, playerStats);
      })
    );
  }
}

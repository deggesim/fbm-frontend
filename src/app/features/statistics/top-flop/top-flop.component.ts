import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
import { Store, select } from '@ngrx/store';
import { isEmpty } from 'lodash-es';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { map, take } from 'rxjs/operators';

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
  selectedPlayerStatistics: PlayerStats;

  @ViewChild('modalPlayerStatistics', { static: false }) modalPlayerStatistics: ModalDirective;
  showPlayerStatistics: boolean;

  form = this.fb.group({
    team: [null as Team],
    fantasyTeam: [null as FantasyTeam],
    role: [null as Role],
    freePlayers: [null as boolean],
  });

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
    this.form.valueChanges.subscribe((value) => {
      const { team, fantasyTeam, role, freePlayers } = value;
      this.page = 1;
      this.loadStatistics(team, fantasyTeam, role, freePlayers);
    });

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

  enablePagination() {
    return !isEmpty(this.playerStatisticList?.content) && this.playerStatisticList?.totalElements > this.limit;
  }

  pageChange(event: { page: number }) {
    this.page = event.page;
    const { team, fantasyTeam, role, freePlayers } = this.form.value;
    this.loadStatistics(team, fantasyTeam, role, freePlayers);
  }

  buildStatistics(player: Player) {
    this.loadPlayerStatistics(player).subscribe((playerStats: PlayerStats) => {
      this.selectedPlayerStatistics = playerStats;
      this.showPlayerStatistics = true;
    });
  }

  reset() {
    this.form.reset();
  }

  hideModal(): void {
    this.modalPlayerStatistics?.hide();
  }

  onHidden(): void {
    this.showPlayerStatistics = false;
  }

  private loadStatistics(team?: Team, fantasyTeam?: FantasyTeam, role?: Role, freePlayers?: boolean) {
    this.playerStatisticService
      .read(this.page, this.limit, team, fantasyTeam, role, freePlayers)
      .subscribe((value: PlayerStatisticList) => {
        this.playerStatisticList = value;
      });
  }

  private loadPlayerStatistics(player: Player) {
    return this.performanceService.getPerformances(player._id).pipe(
      map((performances: Performance[]) => {
        return performances
          .filter((value) => value.realFixture.prepared && value.realFixture._id !== this.nextRealFixture._id)
          .sort((a, b) => a.realFixture.order - b.realFixture.order);
      }),
      map((performances: Performance[]) => ({ player, trend: performances }))
    );
  }
}

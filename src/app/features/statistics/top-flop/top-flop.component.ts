import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { LeagueInfo } from '@app/models/league';
import { Role } from '@app/models/player';
import { PlayerStatistic, PlayerStatisticList } from '@app/models/player-statistics';
import { PlayerStats } from '@app/models/player-stats';
import { RealFixture } from '@app/models/real-fixture';
import { Team } from '@app/models/team';
import { PlayerStatisticService } from '@app/shared/services/player-statistics.service';
import { statistics } from '@app/shared/util/statistics';
import { select, Store } from '@ngrx/store';
import { isEmpty } from 'lodash-es';
import { take } from 'rxjs/operators';

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
    private playerStatisticService: PlayerStatisticService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.roles = [Role.Playmaker, Role.PlayGuardia, Role.Guardia, Role.GuardiaAla, Role.Ala, Role.AlaCentro, Role.Centro];
    this.teams = this.route.snapshot.data.teams;
    this.store.pipe(select(leagueInfo), take(1)).subscribe((value: LeagueInfo) => {
      this.nextRealFixture = value.nextRealFixture;
    });
    this.playerStatisticService.read(this.page, this.limit).subscribe((value: PlayerStatisticList) => {
      this.playerStatisticList = value;
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

  loadStatistics(stat: PlayerStatistic) {
    return statistics(stat.player, stat.performances, this.nextRealFixture);
  }
}


import { Component, OnInit, ViewChild } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { leagueInfo, selectedLeague } from '@app/core/league/store/league.selector';
import { Fixture } from '@app/models/fixture';
import { League, LeagueInfo, Parameter } from '@app/models/league';
import { Lineup } from '@app/models/lineup';
import { Match } from '@app/models/match';
import { Round } from '@app/models/round';
import { TableItem } from '@app/models/table-item';
import { LineupService } from '@app/shared/services/lineup.service';
import { RoundService } from '@app/shared/services/round.service';
import { calculator } from '@app/shared/util/standings';
import { select, Store } from '@ngrx/store';
import { isEmpty } from 'lodash-es';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { filter, forkJoin, Observable, switchMap, take } from 'rxjs';

interface DashboardItem {
  round: Round;
  lastFixture: Fixture;
  table: TableItem[];
  atLeastOneFixtureCompleted: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  dashBoardItems: DashboardItem[] = [];
  trend: Parameter;
  leagueInfo: LeagueInfo;

  selectedFixture: Fixture;
  selectedMatch: Match;
  homeTeamLineup: Lineup[];
  awayTeamLineup: Lineup[];
  @ViewChild('modalMatchResult', { static: false }) modalMatchResult: ModalDirective;
  showModalMatchResult: boolean;

  constructor(private store: Store<AppState>, private roundService: RoundService, private lineupService: LineupService) {}

  ngOnInit(): void {
    this.store
      .pipe(
        select(leagueInfo),
        filter((value) => value != null && value.nextFixture != null),
        switchMap((value: LeagueInfo) => {
          this.leagueInfo = value;
          const nextFixtures = value.nextRealFixture.fixtures;
          const rounds$: Observable<Round>[] = [];
          for (const fixture of nextFixtures) {
            rounds$.push(this.roundService.get(fixture.round));
          }
          return forkJoin(rounds$);
        })
      )
      .subscribe((value: Round[]) => {
        for (const round of value) {
          const fixtures = round.fixtures;
          const fixturesCompleted = fixtures.filter((fixture) => fixture.completed);
          let table: TableItem[] = [];
          let lastFixture: Fixture;
          let atLeastOneFixtureCompleted = false;
          if (fixturesCompleted != null && !isEmpty(fixturesCompleted)) {
            atLeastOneFixtureCompleted = true;
            lastFixture = [...fixturesCompleted].sort((a, b) => b.realFixture?.order - a.realFixture?.order)[0];
            if (round.roundRobin) {
              table = this.loadTable(round);
            }
          }
          this.dashBoardItems.push({ round, table, lastFixture, atLeastOneFixtureCompleted });
        }
      });
  }

  loadTable(round: Round): TableItem[] {
    let tableItems: TableItem[] = [];
    const matches: Match[] = [];
    for (const fixture of round.fixtures) {
      matches.push(...fixture.matches);
    }

    this.store.pipe(select(selectedLeague), take(1)).subscribe((league: League) => {
      for (const fantasyTeam of round.fantasyTeams) {
        this.trend = league.parameters.find((parameter: Parameter) => parameter.parameter === 'TREND');
        const tableItem = calculator(fantasyTeam, matches, this.trend.value);
        tableItems.push(tableItem);
      }

      tableItems.sort((a: TableItem, b: TableItem): number => {
        if (a.points === b.points) {
          return b.difference - a.difference;
        } else {
          return b.points - a.points;
        }
      });
    });
    return tableItems;
  }

  openModalMatchResult(fixture: Fixture, match: Match) {
    if (fixture != null && match != null) {
      this.selectedFixture = fixture;
      this.loadLineups(match).subscribe((lineups: [Lineup[], Lineup[]]) => {
        this.selectedMatch = match;
        this.homeTeamLineup = lineups[0];
        this.awayTeamLineup = lineups[1];
        this.showModalMatchResult = true;
      });
    }
  }

  hideModalMatchResult(): void {
    this.modalMatchResult?.hide();
  }

  onHiddenMatchResult(): void {
    this.showModalMatchResult = false;
  }

  private loadLineups(match: Match): Observable<[Lineup[], Lineup[]]> {
    const homeTeam = match.homeTeam;
    const awayTeam = match.awayTeam;
    const $homeTeamLineup = this.lineupService.lineupByTeam(homeTeam._id, this.selectedFixture._id);
    const $awayTeamLineup = this.lineupService.lineupByTeam(awayTeam._id, this.selectedFixture._id);
    return forkJoin([$homeTeamLineup, $awayTeamLineup]);
  }
}

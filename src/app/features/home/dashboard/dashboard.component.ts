import { Component, OnInit } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { leagueInfo, selectedLeague } from '@app/core/league/store/league.selector';
import { Fixture } from '@app/models/fixture';
import { League, LeagueInfo, Parameter } from '@app/models/league';
import { Match } from '@app/models/match';
import { Round } from '@app/models/round';
import { TableItem } from '@app/models/table-item';
import { RoundService } from '@app/shared/services/round.service';
import { calculator } from '@app/shared/util/standings';
import { select, Store } from '@ngrx/store';
import { EMPTY, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  activeRound: Round;
  table: TableItem[] = [];
  trend: Parameter;
  leagueInfo: LeagueInfo;
  lastFixture: Fixture;

  constructor(private store: Store<AppState>, private roundService: RoundService) {}

  ngOnInit(): void {
    this.store
      .pipe(
        select(leagueInfo),
        switchMap((value: LeagueInfo) => {
          this.leagueInfo = value;
          return value.nextFixture ? this.roundService.get(value.nextFixture.round) : EMPTY;
        })
      )
      .subscribe((value: Round) => {
        if (value) {
          this.activeRound = value;

          const fixtures = value.fixtures;
          const allCompleted = fixtures.every((fixture) => fixture.completed);
          let nextFixture = null;
          if (allCompleted) {
            nextFixture = [...fixtures].sort((a, b) => b._id.localeCompare(a._id))[0];
          } else {
            nextFixture = fixtures.filter((fixture) => !fixture.completed).sort((a, b) => a._id.localeCompare(b._id))[0];
          }
          this.lastFixture = nextFixture;
          this.loadTable();
        }
      });
  }

  loadTable() {
    if (this.activeRound.roundRobin) {
      const matches: Match[] = [];
      for (const fixture of this.activeRound.fixtures) {
        matches.push(...fixture.matches);
      }

      this.store.pipe(select(selectedLeague), take(1)).subscribe((league: League) => {
        for (const fantasyTeam of this.activeRound.fantasyTeams) {
          this.trend = league.parameters.find((parameter: Parameter) => parameter.parameter === 'TREND');
          const tableItem = calculator(fantasyTeam, matches, this.trend.value);
          this.table.push(tableItem);
        }

        this.table.sort((a: TableItem, b: TableItem): number => {
          if (a.points === b.points) {
            return b.difference - a.difference;
          } else {
            return b.points - a.points;
          }
        });
      });
    }
  }
}

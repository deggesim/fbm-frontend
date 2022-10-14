import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { FantasyRoster } from '@app/models/fantasy-roster';
import { FantasyTeam } from '@app/models/fantasy-team';
import { History } from '@app/models/history';
import { LeagueInfo } from '@app/models/league';
import { FantasyRosterService } from '@app/shared/services/fantasy-roster.service';
import { HistoryService } from '@app/shared/services/history.service';
import { select, Store } from '@ngrx/store';
import { memoize } from 'lodash-es';
import { DateTime } from 'luxon';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'fbm-fantasy-rosters',
  templateUrl: './fantasy-rosters.component.html',
  styleUrls: ['./fantasy-rosters.component.scss'],
})
export class FantasyRostersComponent implements OnInit {
  form = this.fb.group({
    fantasyTeam: [null as FantasyTeam, [Validators.required]],
  });

  fantasyTeams: FantasyTeam[];
  fantasyTeamSelected: FantasyTeam;
  fantasyRosters: FantasyRoster[];
  history: History[] = [];
  // for date pipe in template
  DateTime = DateTime;
  String = String;

  private route: ActivatedRoute;
  private fantasyRosterService: FantasyRosterService;
  private historyService: HistoryService;
  private store: Store<AppState>;

  constructor(injector: Injector, private fb: FormBuilder) {
    this.route = injector.get(ActivatedRoute);
    this.fantasyRosterService = injector.get(FantasyRosterService);
    this.historyService = injector.get(HistoryService);
    this.store = injector.get(Store);
  }

  ngOnInit() {
    this.fantasyTeams = this.route.snapshot.data['fantasyTeams'];

    const fantasyTeam = this.route.snapshot.queryParams['fantasyTeam'];
    if (fantasyTeam) {
      const fantasyTeamSelected = this.fantasyTeams.find((value: FantasyTeam) => value._id === fantasyTeam);
      this.form.get('fantasyTeam').setValue(fantasyTeamSelected);
      this.selectFantasyTeam(fantasyTeamSelected);
    }
  }

  selectFantasyTeam(fantasyTeam: FantasyTeam) {
    this.fantasyTeamSelected = fantasyTeam;
    if (fantasyTeam != null) {
      this.store
        .pipe(
          select(leagueInfo),
          switchMap((value: LeagueInfo) => this.fantasyRosterService.read(fantasyTeam._id, value.nextRealFixture._id)),
          tap((fantasyRosters: FantasyRoster[]) => {
            this.fantasyRosters = fantasyRosters;
          }),
          switchMap(() => this.historyService.read(fantasyTeam._id))
        )
        .subscribe((history: History[]) => {
          this.history = [...history].sort(this.sortHistory);
        });
    } else {
      this.fantasyRosters = null;
      this.history = null;
    }
  }

  isPlayer = memoize((item: History): boolean => {
    if ('name' in item) {
      return true;
    } else {
      return false;
    }
  });

  sortHistory = (a: History, b: History): number => {
    if (a.realFixture.order === b.realFixture.order) {
      const updatedAtA = DateTime.fromISO(a.updatedAt as string);
      const updatedAtB = DateTime.fromISO(b.updatedAt as string);
      return updatedAtA < updatedAtB ? -1 : 1;
    } else {
      return a.realFixture.order - b.realFixture.order;
    }
  };
}

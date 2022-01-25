import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { FantasyRoster } from '@app/models/fantasy-roster';
import { FantasyRosterHistory } from '@app/models/fantasy-roster-history';
import { FantasyTeam } from '@app/models/fantasy-team';
import { FantasyTeamHistory } from '@app/models/fantasy-team-history';
import { LeagueInfo } from '@app/models/league';
import { FantasyRosterHistoryService } from '@app/shared/services/fantasy-roster-history.service';
import { FantasyRosterService } from '@app/shared/services/fantasy-roster.service';
import { FantasyTeamHistoryService } from '@app/shared/services/fantasy-team-history.service';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { switchMap, switchMapTo, tap } from 'rxjs/operators';

@Component({
  selector: 'fbm-fantasy-rosters',
  templateUrl: './fantasy-rosters.component.html',
})
export class FantasyRostersComponent implements OnInit {
  form: FormGroup;

  fantasyTeams: FantasyTeam[];
  fantasyTeamSelected: FantasyTeam;
  fantasyRosters: FantasyRoster[];
  htmlHistory: string[] = [];

  private fb: FormBuilder;
  private route: ActivatedRoute;
  private fantasyRosterService: FantasyRosterService;
  private fantasyRosterHistoryService: FantasyRosterHistoryService;
  private fantasyTeamHistoryService: FantasyTeamHistoryService;
  private store: Store<AppState>;

  constructor(injector: Injector) {
    this.fb = injector.get(FormBuilder);
    this.route = injector.get(ActivatedRoute);
    this.fantasyRosterService = injector.get(FantasyRosterService);
    this.fantasyRosterHistoryService = injector.get(FantasyRosterHistoryService);
    this.fantasyTeamHistoryService = injector.get(FantasyTeamHistoryService);
    this.store = injector.get(Store);

    this.createForm();
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

  createForm() {
    this.form = this.fb.group({
      fantasyTeam: [undefined, Validators.required],
    });
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
          switchMapTo(
            forkJoin([this.fantasyRosterHistoryService.read(fantasyTeam._id), this.fantasyTeamHistoryService.read(fantasyTeam._id)])
          )
        )
        .subscribe((values: [FantasyRosterHistory[], FantasyTeamHistory[]]) => {
          const history = [...values[0], ...values[1]].sort(this.sortHistory);
          for (const h of history) {
            if ('name' in h) {
              // player
              const htmlHistoryItem = `${h.realFixture.name} - ${h.operation} ${h.name} - ${h.status} - ${h.contract} - ${h.yearContract} - ${h.role} - ${h.balance}`;
              this.htmlHistory.push(htmlHistoryItem);
            } else {
              // team
              const htmlHistoryItem = `${h.realFixture} - ${h.initialBalance} - ${h.outgo} - ${h.totalContracts} - ${h.playersInRoster} - ${h.extraPlayers} - ${h.pointsPenalty} -  ${h.balancePenalty}`;
              this.htmlHistory.push(htmlHistoryItem);
            }
            
          }
        });
    } else {
      this.fantasyRosters = null;
      this.htmlHistory = null;
    }
  }

  sortHistory = (a: FantasyRosterHistory | FantasyTeamHistory, b: FantasyRosterHistory | FantasyTeamHistory): number => {
    if (a.realFixture.order === b.realFixture.order) {
      const updatedAtA = moment(a.updatedAt);
      const updatedAtB = moment(b.updatedAt);
      return updatedAtA.diff(updatedAtB);
    } else {
      return a.realFixture.order - b.realFixture.order;
    }
  };
}

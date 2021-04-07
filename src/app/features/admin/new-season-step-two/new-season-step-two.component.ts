import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { LeagueService } from '@app/core/league/services/league.service';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { FantasyTeam } from '@app/models/fantasy-team';
import { League } from '@app/models/league';
import { User } from '@app/models/user';
import { FantasyTeamService } from '@app/shared/services/fantasy-team.service';
import { Store } from '@ngrx/store';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-new-season-step-two',
  templateUrl: './new-season-step-two.component.html',
})
export class NewSeasonStepTwoComponent implements OnInit {
  league: League;

  form: FormGroup;
  teams = 0;
  users: User[];
  usersLoading = false;
  arrayItems = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private leagueService: LeagueService,
    private fantastyTeamsService: FantasyTeamService,
    private store: Store<AppState>
  ) {
    this.league = this.router.getCurrentNavigation().extras.state?.data;
    this.createForm();
  }

  ngOnInit() {
    if (this.league == null) {
      this.router.navigate(['/home']);
    }
    this.addItem();

    this.usersLoading = true;
    this.route.data.subscribe((data) => {
      this.users = data.users;
      this.usersLoading = false;
    });
  }

  createForm() {
    this.form = this.fb.group({
      teamsArray: this.fb.array([]),
    });
  }

  confirm() {
    const fantasyTeams = this.form.get('teamsArray').value as FantasyTeam[];
    let newLeague: League;

    this.leagueService
      .create(this.league)
      .pipe(
        switchMap((league: League) => {
          newLeague = league;
          return this.fantastyTeamsService.create(fantasyTeams);
        }),
        switchMap(() => this.leagueService.populate(newLeague)),
        tap((league: League) => {
          this.store.dispatch(LeagueActions.setSelectedLeague({ league }));
          this.store.dispatch(LeagueInfoActions.refresh({ league }));
        })
      )
      .subscribe(() => {
        this.router.navigate(['/home']);
      });
  }

  get teamsArray() {
    return this.form.get('teamsArray') as FormArray;
  }

  addItem() {
    const item = { _id: ++this.teams, title: `Squadra ${this.teams}` };
    this.arrayItems.push(item);
    this.teamsArray.push(
      this.fb.group({
        name: [undefined, Validators.required],
        owners: [undefined, Validators.required],
      })
    );
  }

  removeItem() {
    this.teams--;
    this.arrayItems.pop();
    this.teamsArray.removeAt(this.teamsArray.length - 1);
  }

  trackUserByFn(user: User) {
    return user._id;
  }
}

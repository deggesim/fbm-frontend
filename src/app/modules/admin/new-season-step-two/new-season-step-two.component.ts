import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FantasyTeam } from '@app/shared/models/fantasy-team';
import { League } from '@app/shared/models/league';
import { User } from '@app/shared/models/user';
import { AuthService } from '@app/shared/services/auth.service';
import { FantasyTeamService } from '@app/shared/services/fantasy-team.service';
import { LeagueService } from '@app/shared/services/league.service';
import { NewSeasonService } from '@app/shared/services/new-season.service';
import { refresh } from '@app/store/actions/league-info.actions';
import { setSelectedLeague } from '@app/store/actions/league.actions';
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
    private authService: AuthService,
    private leagueService: LeagueService,
    private newSeasonService: NewSeasonService,
    private fantastyTeamsService: FantasyTeamService,
    private store: Store
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

    this.newSeasonService
      .create(this.league)
      .pipe(
        switchMap((league: League) => {
          newLeague = league;
          return this.fantastyTeamsService.create(fantasyTeams);
        }),
        switchMap(() => this.newSeasonService.populate(newLeague)),
        tap((league: League) => {
          this.store.dispatch(setSelectedLeague({ league }));
          this.store.dispatch(refresh());
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

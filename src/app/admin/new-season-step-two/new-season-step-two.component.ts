import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FantasyTeam } from '@app/models/fantasy-team';
import { League } from '@app/models/league';
import { User } from '@app/models/user';
import { AuthService } from '@app/services/auth.service';
import { FantasyTeamService } from '@app/services/fantasy-team.service';
import { LeagueService } from '@app/services/league.service';
import { NewSeasonService } from '@app/services/new-season.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-new-season-step-two',
  templateUrl: './new-season-step-two.component.html',
  styleUrls: ['./new-season-step-two.component.scss']
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
  ) {
    this.league = this.router.getCurrentNavigation().extras.state.data;
    this.createForm();
  }

  ngOnInit() {
    this.addItem();

    this.usersLoading = true;
    this.route.data.subscribe(
      (data) => {
        this.users = data.users;
        this.usersLoading = false;
      }
    );
  }

  createForm() {
    this.form = this.fb.group({
      teamsArray: this.fb.array([])
    });
  }

  confirm() {
    const fantasyTeams = this.form.get('teamsArray').value as FantasyTeam[];
    let newLeague: League;

    this.newSeasonService.create(this.league).pipe(
      tap(league => newLeague = league),
      switchMap((league: League) => {
        console.log(league);
        this.leagueService.setSelectedLeague(league);
        return this.fantastyTeamsService.create(fantasyTeams);
      }),
      switchMap(() => this.newSeasonService.populate(newLeague)),
      switchMap(() => this.authService.refresh()),
      switchMap(() => this.leagueService.leagueStatusObservableChain)
    ).subscribe(() => {
      this.router.navigate(['/home']);
    });

  }

  get teamsArray() {
    return this.form.get('teamsArray') as FormArray;
  }

  addItem() {
    const item = { _id: ++this.teams, title: `Squadra ${this.teams}`, };
    this.arrayItems.push(item);
    this.teamsArray.push(this.fb.group({
      name: [undefined, Validators.required],
      owners: [undefined, Validators.required]
    }));
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

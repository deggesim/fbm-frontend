import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '@app/core/app.state';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { FantasyTeam } from '@app/models/fantasy-team';
import { League } from '@app/models/league';
import { User } from '@app/models/user';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-new-season-step-two',
  templateUrl: './new-season-step-two.component.html',
})
export class NewSeasonStepTwoComponent implements OnInit {
  league: League;

  form: UntypedFormGroup;
  teams = 0;
  users: User[];
  usersLoading = false;
  arrayItems: { id: number; title: string }[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private fb: UntypedFormBuilder, private store: Store<AppState>) {
    this.league = this.router.getCurrentNavigation().extras.state?.['data'];
    this.createForm();
  }

  ngOnInit() {
    if (this.league == null) {
      this.router.navigate(['/home']);
    } else {
      this.addItem();
      this.users = this.route.snapshot.data['users'];
    }
  }

  createForm() {
    this.form = this.fb.group({
      teamsArray: this.fb.array([]),
    });
  }

  confirm() {
    const fantasyTeams = this.form.get('teamsArray').value as FantasyTeam[];
    this.store.dispatch(LeagueActions.createLeague({ league: this.league, fantasyTeams }));
  }

  get teamsArray() {
    return this.form.get('teamsArray') as UntypedFormArray;
  }

  addItem() {
    const item = { id: ++this.teams, title: `Squadra ${this.teams}` };
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

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FantasyTeam } from 'src/app/models/fantasy-team';
import { League } from 'src/app/models/league';
import { User } from 'src/app/models/user';
import { NewSeasonService } from 'src/app/services/new-season.service';
import { SharedService } from 'src/app/shared/shared.service';
import * as _ from 'lodash';

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
    private sharedService: SharedService,
    private newSeasonService: NewSeasonService,
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
    const teams = this.form.get('teamsArray').value as FantasyTeam[];
    this.league.fantasyTeams = teams;
    this.newSeasonService.createLeague(this.league).subscribe();
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

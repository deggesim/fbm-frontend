import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { League } from 'src/app/models/league';
import { User } from 'src/app/models/user';
import { NewSeasonService } from 'src/app/services/new-season.service';
import { Observable, Subject, concat, of } from 'rxjs';
import { distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-new-season-step-two',
  templateUrl: './new-season-step-two.component.html',
  styleUrls: ['./new-season-step-two.component.scss']
})
export class NewSeasonStepTwoComponent implements OnInit {

  step1: League;

  form: FormGroup;
  teams = 0;

  users: User[];

  users$: Observable<User[]>;
  usersLoading = false;
  usersInput$ = new Subject<string>();
  selectedUsers: User[];

  arrayItems: {
    id: number;
    title: string;
    owner?: User[];
  }[];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private newSeasonService: NewSeasonService,
  ) {
    // this.step1 = this.router.getCurrentNavigation().extras.state.data;
    this.createForm();
  }

  ngOnInit() {
    this.arrayItems = [];
    this.addItem();

    this.route.data.subscribe(
      (data) => {
        this.users = data.users;
      }
    );
  }

  createForm() {
    this.form = this.fb.group({
      teamsArray: this.fb.array([])
    });
  }

  confirm() {
    this.newSeasonService.createLeague(this.step1);
  }

  get teamsArray() {
    return this.form.get('teamsArray') as FormArray;
  }

  addItem() {
    const item = { id: ++this.teams, title: `Squadra ${this.teams}`, };
    this.arrayItems.push(item);
    this.teamsArray.push(this.fb.group({
      teamName: [undefined, Validators.required],
    }));
  }

  removeItem() {
    this.teams--;
    this.arrayItems.pop();
    this.teamsArray.removeAt(this.teamsArray.length - 1);
  }

  trackUserByFn(user: User) {
    return user.id;
  }

}

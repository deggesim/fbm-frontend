import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Performance } from 'src/app/models/performance';
import { RealFixture } from 'src/app/models/real-fixture';
import { Team } from 'src/app/models/team';
import { PerformanceService } from 'src/app/services/performance.service';

@Component({
  selector: 'app-performances',
  templateUrl: './performances.component.html',
  styleUrls: ['./performances.component.scss']
})
export class PerformancesComponent implements OnInit {

  form: FormGroup;
  teams: Team[];
  realFixtures: RealFixture[];
  selectedTeam: Team;
  selectedRealFixture: RealFixture;
  performances: Performance[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private performanceService: PerformanceService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('init PerformancesComponent');
    this.route.data.subscribe(
      (data) => {
        this.teams = data.teams;
        this.realFixtures = data.realFixtures;
      }
    );
  }

  createForm() {
    this.form = this.fb.group({
      team: [undefined, Validators.required],
      realFixture: [undefined, Validators.required],
      url: [undefined],
      filter: [0],
      performanceArray: this.fb.array([])
    });
  }

  get performanceArray(): FormArray {
    return this.form.get('performanceArray') as FormArray;
  }

  onChangeTeam(team: Team) {
    this.selectedTeam = team;
    if (this.selectedRealFixture != null) {
      this.loadPerformances();
    }
  }

  onChangeRealFixture(realFixture: RealFixture) {
    this.selectedRealFixture = realFixture;
    if (this.selectedTeam != null) {
      this.loadPerformances();
    }
  }

  onChangeFilter(event: any) {
    console.log(event.value);
  }

  loadPerformances() {
    this.performanceService.getByRealFixture(this.selectedTeam._id, this.selectedRealFixture._id)
      .subscribe((performances: Performance[]) => {
        console.log(performances);
        this.performances = performances;
        for (const performance of performances) {
          this.performanceArray.push(this.fb.group({
            _id: performance._id,
            ranking: [performance.ranking],
            minutes: [performance.minutes],
            grade: [performance.grade],
          }));
        }
      });
  }

  retrievePerformances() {
    console.log('retrievePerformances');
    console.log(this.form.controls.url);
  }

  salva() {
    console.log('salva');
    console.log(this.form);
  }

}

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toastType } from '@app/shared/constants/globals';
import { Performance } from '@app/shared/models/performance';
import { RealFixture } from '@app/shared/models/real-fixture';
import { Team } from '@app/shared/models/team';
import { PerformanceService } from '@app/shared/services/performance.service';
import { SharedService } from '@app/shared/services/shared.service';

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
  disableRetrieve = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sharedService: SharedService,
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
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    this.form = this.fb.group({
      team: [undefined, Validators.required],
      realFixture: [undefined, Validators.required],
      url: [undefined, [Validators.pattern(urlRegex)]],
      filter: [0],
      performanceArray: this.fb.array([])
    });

    this.form.get('filter').valueChanges.subscribe((value: number) => {
      this.getPerformances(value);
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
    console.log(event);
  }

  loadPerformances() {
    this.form.get('performanceArray').reset();
    this.performanceArray.clear();
    this.getPerformances();
  }

  retrievePerformances() {
    this.performanceService.boxScore(this.selectedTeam._id, this.selectedRealFixture._id, this.form.value.url)
      .subscribe((performances: Performance[]) => {
        this.form.get('performanceArray').reset();
        this.performanceArray.clear();
        this.performances = performances;
        for (const performance of performances) {
          this.performanceArray.push(this.fb.group({
            _id: performance._id,
            ranking: [performance.ranking],
            minutes: [performance.minutes],
            grade: [performance.grade],
          }));
        }
        const title = 'Valutazioni recuperate';
        const message = 'Le valutazioni sono state recuperate correttamente';
        this.sharedService.notifica(toastType.success, title, message);
      });
  }

  getPlayer(performance: Performance) {
    return `${performance.player.name} - ${performance.player.nationality} - ${performance.player.role}`;
  }

  salva() {
    const performances = this.form.get('performanceArray').value as Performance[];
    this.performanceService.save(performances).subscribe(() => {
      const title = 'Valutazioni salvate';
      const message = 'Le valutazioni sono state salvate correttamente';
      this.sharedService.notifica(toastType.success, title, message);
    });
  }

  private getPerformances(filter?: number) {
    this.performanceService.getByRealFixture(this.selectedTeam._id, this.selectedRealFixture._id, filter)
      .subscribe((performances: Performance[]) => {
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

}

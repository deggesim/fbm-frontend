import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Performance } from '@app/models/performance';
import { RealFixture } from '@app/models/real-fixture';
import { Team } from '@app/models/team';
import { AppConfig } from '@app/shared/constants/globals';
import { PerformanceService } from '@app/shared/services/performance.service';
import { ToastService } from '@app/shared/services/toast.service';

@Component({
  selector: 'app-performances',
  templateUrl: './performances.component.html',
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
    private toastService: ToastService,
    private performanceService: PerformanceService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.teams = this.route.snapshot.data.teams;
    this.realFixtures = this.route.snapshot.data.realFixtures;
  }

  createForm() {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    this.form = this.fb.group({
      team: [undefined, Validators.required],
      realFixture: [undefined, Validators.required],
      url: [undefined, [Validators.pattern(urlRegex)]],
      filter: [0],
      bonus: [undefined],
      performanceArray: this.fb.array([]),
    });

    this.form.get('filter').valueChanges.subscribe((value: number) => {
      this.getPerformances(value);
    });

    this.form.get('bonus').valueChanges.subscribe((value: boolean) => {
      this.applyBonusMalus();
    });
  }

  get performanceArray(): FormArray {
    return this.form.get('performanceArray') as FormArray;
  }

  onChangeTeam(team: Team) {
    this.selectedTeam = team;
    this.form.get('bonus').reset();
    if (this.selectedRealFixture != null) {
      this.loadPerformances();
    }
  }

  onChangeRealFixture(realFixture: RealFixture) {
    this.selectedRealFixture = realFixture;
    this.form.get('bonus').reset();
    if (this.selectedTeam != null) {
      this.loadPerformances();
    }
  }

  loadPerformances() {
    this.performanceArray.reset();
    this.performanceArray.clear();
    this.getPerformances();
  }

  retrievePerformances() {
    this.performanceService
      .boxScore(this.selectedTeam._id, this.selectedRealFixture._id, this.form.value.url)
      .subscribe((performances: Performance[]) => {
        this.performanceArray.reset();
        this.performanceArray.clear();
        this.performances = performances;
        for (const performance of performances) {
          this.performanceArray.push(
            this.fb.group({
              _id: performance._id,
              ranking: [performance.ranking],
              minutes: [performance.minutes],
              grade: [performance.grade],
            })
          );
        }
        this.toastService.success('Valutazioni recuperate', 'Le valutazioni sono state recuperate correttamente');
      });
  }

  getPlayer(performance: Performance) {
    return `${performance.player.name} - ${performance.player.nationality} - ${performance.player.role}`;
  }

  salva() {
    const performances = this.performanceArray.getRawValue() as Performance[];
    this.performanceService.save(performances).subscribe(() => {
      this.toastService.success('Valutazioni salvate', 'Le valutazioni sono state salvate correttamente');
    });
  }

  reset() {
    if (this.selectedTeam?._id != null && this.selectedRealFixture?._id != null) {
      this.form.get('bonus').reset();
      this.loadPerformances();
    }
  }

  private getPerformances(filter?: number) {
    this.performanceService
      .getByRealFixture(this.selectedTeam._id, this.selectedRealFixture._id, filter)
      .subscribe((performances: Performance[]) => {
        this.performances = performances;
        for (const performance of performances) {
          const performanceFG = this.fb.group({
            _id: performance._id,
            ranking: [performance.ranking],
            minutes: [performance.minutes, [Validators.min(0)]],
            grade: [performance.grade, [Validators.min(0), Validators.max]],
          });
          this.performanceArray.push(performanceFG);
          if (performance.minutes == null || performance.minutes === 0) {
            performanceFG.get('grade').disable();
            performanceFG.get('ranking').disable();
          }

          performanceFG.valueChanges.subscribe((perf: Performance) => {
            if (perf.minutes == null || perf.minutes === 0) {
              performanceFG.get('grade').disable({ emitEvent: false });
              performanceFG.get('grade').setValue(null, { emitEvent: false });
              if (perf.minutes === 0) {
                performanceFG.get('ranking').disable({ emitEvent: false });
                performanceFG.get('ranking').setValue(0, { emitEvent: false });
              } else {
                performanceFG.get('ranking').setValue(null, { emitEvent: false });
              }
            } else {
              if (performanceFG.get('grade').disabled) {
                performanceFG.get('grade').enable({ emitEvent: false });
                performanceFG.get('grade').setValue(performance.grade, { emitEvent: false });
              }
              if (performanceFG.get('ranking').disabled) {
                performanceFG.get('ranking').enable({ emitEvent: false });
                performanceFG.get('ranking').setValue(performance.ranking, { emitEvent: false });
              }
            }
          });
        }
      });
  }

  private applyBonusMalus() {
    const bonus = this.form.get('bonus').value;
    Object.keys(this.performanceArray.controls).forEach((key: string) => {
      const formControl = this.performanceArray.controls[key];
      const minutes = formControl.get('minutes').value;
      if (minutes != null && minutes > 0) {
        // player played
        formControl.get('grade').setValue(bonus ? AppConfig.WinBonus : AppConfig.DefeatMalus);
      } else {
        formControl.get('grade').reset();
      }
    });
  }
}

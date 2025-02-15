import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Match } from '@app/models/match';

@Component({
  selector: 'fbm-calendar-form',
  templateUrl: './calendar-form.component.html',
})
export class CalendarFormComponent implements OnChanges {
  @Input() matches: Match[];
  @Output() save: EventEmitter<any> = new EventEmitter(true);
  @Output() cancel: EventEmitter<any> = new EventEmitter(true);

  form = this.fb.group({
    matchArray: this.fb.array([] as Match[]),
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    const matches: Match[] = changes['matches'].currentValue;
    if (matches != null) {
      for (const match of matches) {
        const fbGroup = this.fb.group({
          _id: match._id,
          homeRanking: [match.homeRanking],
          awayRanking: [match.awayRanking],
          homeGrade: [match.homeGrade],
          awayGrade: [match.awayGrade],
          homeScore: [match.homeScore],
          awayScore: [match.awayScore],
          overtime: [match.overtime],
          completed: [match.completed],
        });
        if (fbGroup.get('completed').value) {
          fbGroup.get('homeScore').setValidators(Validators.required);
          fbGroup.get('awayScore').setValidators(Validators.required);
        }
        this.matchArray.push(fbGroup);
      }
    }
  }

  get matchArray(): FormArray {
    return this.form.get('matchArray') as FormArray;
  }

  getFormControl(index: number, controlName: string): AbstractControl {
    return (this.form.get('matchArray') as FormArray).at(index).get(controlName);
  }

  onSubmit(): void {
    this.save.emit(this.form.get('matchArray').value);
  }

  manageCompleted(index: number) {
    this.getFormControl(index, 'homeScore').clearValidators();
    this.getFormControl(index, 'awayScore').clearValidators();
    if (this.getFormControl(index, 'completed').value) {
      this.getFormControl(index, 'homeScore').setValidators(Validators.required);
      this.getFormControl(index, 'awayScore').setValidators(Validators.required);
    }
    this.getFormControl(index, 'homeScore').updateValueAndValidity();
    this.getFormControl(index, 'awayScore').updateValueAndValidity();
  }
}

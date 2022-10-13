import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Match } from '@app/models/match';

@Component({
  selector: 'fbm-calendar-form',
  templateUrl: './calendar-form.component.html',
})
export class CalendarFormComponent implements OnChanges {
  @Input() matches: Match[];
  @Output() save: EventEmitter<any> = new EventEmitter(true);
  @Output() cancel: EventEmitter<any> = new EventEmitter(true);

  form: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder) {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const matches: Match[] = changes['matches'].currentValue;
    if (matches != null) {
      for (const match of matches) {
        this.matchArray.push(
          this.fb.group({
            _id: match._id,
            homeRanking: [match.homeRanking],
            awayRanking: [match.awayRanking],
            homeGrade: [match.homeGrade],
            awayGrade: [match.awayGrade],
            homeScore: [match.homeScore],
            awayScore: [match.awayScore],
            overtime: [match.overtime],
            completed: [match.completed],
          })
        );
      }
    }
  }

  createForm() {
    this.form = this.fb.group({
      matchArray: this.fb.array([]),
    });
  }

  get matchArray(): UntypedFormArray {
    return this.form.get('matchArray') as UntypedFormArray;
  }

  getFormControl(index: number, controlName: string): AbstractControl {
    return (this.form.get('matchArray') as UntypedFormArray).at(index).get(controlName);
  }

  onSubmit(): void {
    this.save.emit(this.form.get('matchArray').value);
  }
}

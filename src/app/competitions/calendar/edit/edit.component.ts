import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Match } from '@app/models/match';

@Component({
  selector: 'app-calendar-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnChanges {

  @Input() matches: Match[];
  @Output() salva: EventEmitter<any> = new EventEmitter(true);
  @Output() annulla: EventEmitter<any> = new EventEmitter(true);

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('EditComponent');
  }

  ngOnChanges(changes: SimpleChanges): void {
    const matches: Match[] = changes.matches.currentValue;
    if (matches != null) {
      for (const match of matches) {
        this.matchArray.push(this.fb.group({
          _id: match._id,
          homeRanking: [match.homeRanking],
          awayRanking: [match.awayRanking],
          homeGrade: [match.homeGrade],
          awayGrade: [match.awayGrade],
          homeScore: [match.homeScore],
          awayScore: [match.awayScore],
          overtime: [match.overtime],
          completed: [match.completed],
        }));
      }
    }
  }

  createForm() {
    this.form = this.fb.group({
      matchArray: this.fb.array([])
    });
  }

  get matchArray(): FormArray {
    return this.form.get('matchArray') as FormArray;
  }

  getFormControl(index: number, controlName: string): AbstractControl {
    return (this.form.get('matchArray') as FormArray).at(index).get(controlName);
  }

  salvaEvent(): void {
    this.salva.emit(this.form.get('matchArray').value);
  }

}

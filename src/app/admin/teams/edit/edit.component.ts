import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'app-team-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnChanges {

  @Input() team: Team;
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
    const team: Team = changes.team.currentValue;
    if (team != null) {
      const { fullName, sponsor, name, city, abbreviation } = team;
      this.form.patchValue({ fullName, sponsor, name, city, abbreviation });
    }
  }

  createForm() {
    this.form = this.fb.group({
      fullName: [undefined, Validators.required],
      sponsor: [undefined],
      name: [undefined],
      city: [undefined],
      abbreviation: [undefined],
    });
  }

  save(): void {
    const { fullName, sponsor, name, city, abbreviation } = this.form.value;
    const team: Team = { _id: this.team ? this.team._id : null, fullName, sponsor, name, city, abbreviation, real: true };
    this.salva.emit(team);
  }

}

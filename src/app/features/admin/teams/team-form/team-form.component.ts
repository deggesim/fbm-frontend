import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Team } from '@app/models/team';

@Component({
  selector: 'fbm-team-form',
  templateUrl: './team-form.component.html',
})
export class TeamFormComponent implements OnChanges {
  @Input() team: Team;
  @Output() salva: EventEmitter<any> = new EventEmitter(true);
  @Output() annulla: EventEmitter<any> = new EventEmitter(true);

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const team: Team = changes['team'].currentValue;
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

  salvaEvent(): void {
    const { fullName, sponsor, name, city, abbreviation } = this.form.value;
    const team: Team = { _id: this.team ? this.team._id : null, fullName, sponsor, name, city, abbreviation, real: true };
    this.salva.emit(team);
  }
}

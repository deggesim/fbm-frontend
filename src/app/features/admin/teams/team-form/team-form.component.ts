import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Team } from '@app/models/team';

@Component({
  selector: 'fbm-team-form',
  templateUrl: './team-form.component.html',
})
export class TeamFormComponent implements OnChanges {
  @Input() team: Team;
  @Output() save: EventEmitter<any> = new EventEmitter(true);
  @Output() cancel: EventEmitter<any> = new EventEmitter(true);

  form = this.fb.group({
    fullName: [null as string, Validators.required],
    sponsor: [null as string],
    name: [null as string],
    city: [null as string],
    abbreviation: [null as string],
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    const team: Team = changes['team'].currentValue;
    if (team != null) {
      const { fullName, sponsor, name, city, abbreviation } = team;
      this.form.patchValue({ fullName, sponsor, name, city, abbreviation });
    }
  }

  onSubmit(): void {
    const { fullName, sponsor, name, city, abbreviation } = this.form.value;
    const team: Team = { _id: this.team ? this.team._id : null, fullName, sponsor, name, city, abbreviation, real: true };
    this.save.emit(team);
  }
}

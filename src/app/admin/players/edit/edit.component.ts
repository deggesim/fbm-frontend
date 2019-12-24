import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Player, Role } from 'src/app/models/player';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-player-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnChanges {

  @Input() player: Player;
  @Output() salva: EventEmitter<any> = new EventEmitter(true);
  @Output() annulla: EventEmitter<any> = new EventEmitter(true);

  form: FormGroup;

  roles: Role[];

  constructor(
    private fb: FormBuilder,
    public sharedService: SharedService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('EditComponent');
    this.roles = [Role.Playmaker, Role.PlayGuardia, Role.Guardia, Role.GuardiaAla, Role.Ala, Role.AlaCentro, Role.Centro];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const player: Player = changes.player.currentValue;
    if (player != null) {
      // tslint:disable-next-line: variable-name
      const { name, nationality, number, yearBirth, height, weight, role } = player;
      this.form.patchValue({ name, nationality, number, yearBirth, height, weight, role });
    }
  }

  createForm() {
    this.form = this.fb.group({
      name: [undefined, Validators.required],
      nationality: [undefined, Validators.required],
      number: [undefined],
      yearBirth: [undefined],
      height: [undefined],
      weight: [undefined],
      role: [undefined, Validators.required],
    });
  }

  save(): void {
    // tslint:disable-next-line: variable-name
    const { name, nationality, number, yearBirth, height, weight, role } = this.form.value;
    const player: Player = { _id: this.player ? this.player._id : null, name, nationality, number, yearBirth, height, weight, role };
    this.salva.emit(player);
  }

}

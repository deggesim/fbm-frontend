import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-user-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnChanges {

  @Input() user: User;
  @Output() salva: EventEmitter<any> = new EventEmitter(true);
  @Output() annulla: EventEmitter<any> = new EventEmitter(true);

  form: FormGroup;
  roleList = ['User', 'Admin', 'SuperAdmin'];

  constructor(
    private fb: FormBuilder,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('EditComponent');
  }

  ngOnChanges(changes: SimpleChanges): void {
    const user: User = changes.user.currentValue;
    if (user != null) {
      const { name, email, role } = user;
      this.form.patchValue({ name, email, role });
    }
  }

  createForm() {
    this.form = this.fb.group({
      name: [undefined, Validators.required],
      email: [undefined, Validators.required],
      password: [undefined],
      role: [undefined, Validators.required],
    });
  }

  save(): void {
    const { name, email, password, role } = this.form.value;
    const user: User = { _id: this.user ? this.user._id : null, name, email, password, role };
    this.salva.emit(user);
  }

}

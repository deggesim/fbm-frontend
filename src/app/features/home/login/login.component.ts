import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Login } from '@app/models/user';

@Component({
  selector: 'fbm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Output() login: EventEmitter<any> = new EventEmitter(true);

  form: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder) {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      email: [undefined, Validators.required],
      password: [undefined, Validators.required],
    });
  }

  confirm(): void {
    const user: Login = {
      email: this.form.value.email,
      password: this.form.value.password,
    };
    this.login.emit(user);
  }
}

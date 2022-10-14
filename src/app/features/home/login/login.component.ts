import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Login } from '@app/models/user';

@Component({
  selector: 'fbm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Output() login: EventEmitter<any> = new EventEmitter(true);

  form = this.fb.group({
    email: [null as string, [Validators.required]],
    password: [null as string, [Validators.required]],
  });

  constructor(private fb: FormBuilder) {}

  confirm(): void {
    const user: Login = {
      email: this.form.value.email,
      password: this.form.value.password,
    };
    this.login.emit(user);
  }
}

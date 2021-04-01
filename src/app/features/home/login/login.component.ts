import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from '@app/models/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output() login: EventEmitter<any> = new EventEmitter(true);

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {}

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

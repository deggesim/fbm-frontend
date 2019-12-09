import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';
import * as globals from '../shared/globals';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  @Output() salva: EventEmitter<any> = new EventEmitter(true);
  @Output() annulla: EventEmitter<any> = new EventEmitter(true);

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.form = this.fb.group({
      id: user.id,
      email: [user.email, Validators.required],
      newPassword: [undefined, Validators.required],
      confirmPassword: [undefined, Validators.required],
      admin: [undefined, Validators.required],
    });
  }

  confirm(): void {
    if (this.form.value.newPassword === this.form.value.confirmPassword) {
      const user: User = {
        id: this.form.value.id,
        name: this.form.value.name,
        email: this.form.value.email,
        password: this.form.value.newPassword,
        admin: this.form.value.admin,
      };
      this.salva.emit(user);
    } else {
      const title = 'Errore password';
      const message = 'Le password non coincidono';
      this.sharedService.notifica(globals.toastType.warning, title, message);
    }
  }

}

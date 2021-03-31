import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { toastType } from '@app/shared/constants/globals';
import { Role, User } from '@app/shared/models/user';
import { SharedService } from '@app/shared/services/shared.service';
import { AppState } from '@app/store/app.state';
import { user } from '@app/store/selectors/user.selector';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  @Output() salva: EventEmitter<any> = new EventEmitter(true);
  @Output() annulla: EventEmitter<any> = new EventEmitter(true);

  form: FormGroup;
  user: User;
  superAdmin: boolean;

  constructor(private fb: FormBuilder, private sharedService: SharedService, private store: Store<AppState>) {}

  ngOnInit() {
    this.store.pipe(select(user)).subscribe((user: User) => {
      this.user = user;
      this.superAdmin = user && Role.SuperAdmin === user.role;
      this.createForm();
    });
  }

  createForm() {
    this.form = this.fb.group({
      _id: this.user._id,
      name: [this.user.name, Validators.required],
      email: [this.user.email, Validators.required],
      newPassword: [undefined, Validators.required],
      confirmPassword: [undefined, Validators.required],
    });
  }

  confirm(): void {
    if (this.form.value.newPassword === this.form.value.confirmPassword) {
      const user: User = {
        _id: this.form.value._id,
        name: this.form.value.name,
        email: this.form.value.email,
        password: this.form.value.newPassword,
        role: this.user.role,
      };
      this.salva.emit(user);
    } else {
      const title = 'Errore password';
      const message = 'Le password non coincidono';
      this.sharedService.notifica(toastType.warning, title, message);
    }
  }
}

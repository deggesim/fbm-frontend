import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState } from '@app/core/app.state';
import { user } from '@app/core/user/store/user.selector';
import { Role, User } from '@app/models/user';
import { ToastService } from '@app/shared/services/toast.service';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Component({
  selector: 'fbm-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  @Output() salva: EventEmitter<any> = new EventEmitter(true);
  @Output() cancel: EventEmitter<any> = new EventEmitter(true);

  form: FormGroup;
  user: User;
  superAdmin: boolean;

  constructor(private fb: FormBuilder, private toastService: ToastService, private store: Store<AppState>) {}

  ngOnInit() {
    this.store.pipe(select(user), take(1)).subscribe((user: User) => {
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
      this.toastService.warning('Errore password', 'Le password non coincidono');
    }
  }
}

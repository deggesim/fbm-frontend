import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  @Output() save: EventEmitter<any> = new EventEmitter(true);
  @Output() cancel: EventEmitter<any> = new EventEmitter(true);

  user: User;
  form = this.fb.group({
    _id: [null as string],
    name: [null as string, [Validators.required]],
    email: [null as string, [Validators.required]],
    newPassword: [null as string, [Validators.required]],
    confirmPassword: [null as string, [Validators.required]],
  });

  superAdmin: boolean;

  constructor(private fb: FormBuilder, private toastService: ToastService, private store: Store<AppState>) {}

  ngOnInit() {
    this.store.pipe(select(user), take(1)).subscribe((user: User) => {
      this.user = user;
      this.superAdmin = user && Role.SuperAdmin === user.role;
      this.form.patchValue({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    });
  }

  confirm(): void {
    if (this.form.value.newPassword === this.form.value.confirmPassword) {
      const newUser: User = {
        _id: this.form.value._id,
        name: this.form.value.name,
        email: this.form.value.email,
        password: this.form.value.newPassword,
        role: this.user.role,
      };
      this.save.emit(newUser);
    } else {
      this.toastService.warning('Errore password', 'Le password non coincidono');
    }
  }
}

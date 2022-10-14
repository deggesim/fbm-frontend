import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '@app/core/user/services/user.service';
import { Role, User } from '@app/models/user';
import { iif, Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

@Component({
  selector: 'fbm-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: User;
  @Output() save: EventEmitter<any> = new EventEmitter(true);
  @Output() cancel: EventEmitter<any> = new EventEmitter(true);

  form = this.fb.group({
    name: [null as string, Validators.required],
    email: [null as string, Validators.required],
    password: [null as string],
    role: [null as Role, Validators.required],
  });

  roleList$: Observable<string[]>;

  constructor(private fb: FormBuilder, private authService: UserService) {}

  ngOnInit() {
    this.roleList$ = this.authService.isSuperAdmin$().pipe(
      take(1),
      mergeMap((isSuperAdmin: boolean) => iif(() => isSuperAdmin, of(['User', 'Admin']), of(['User'])))
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const user: User = changes['user'].currentValue;
    if (user != null) {
      const { name, email, role } = user;
      this.form.patchValue({ name, email, role });
    }
  }

  onSubmit(): void {
    const { name, email, password, role } = this.form.value;
    const user: User = { _id: this.user ? this.user._id : null, name, email, password, role };
    this.save.emit(user);
  }
}

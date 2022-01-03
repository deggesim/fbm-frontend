import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@app/core/user/services/user.service';
import { User } from '@app/models/user';
import { iif, Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: User;
  @Output() salva: EventEmitter<any> = new EventEmitter(true);
  @Output() annulla: EventEmitter<any> = new EventEmitter(true);

  form: FormGroup;
  roleList$: Observable<string[]>;

  constructor(private fb: FormBuilder, private authService: UserService) {
    this.createForm();
  }

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

  createForm() {
    this.form = this.fb.group({
      name: [undefined, Validators.required],
      email: [undefined, Validators.required],
      password: [undefined],
      role: [undefined, Validators.required],
    });
  }

  salvaEvent(): void {
    const { name, email, password, role } = this.form.value;
    const user: User = { _id: this.user ? this.user._id : null, name, email, password, role };
    this.salva.emit(user);
  }
}

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/shared/models/user';
import { AuthService } from '@app/shared/services/auth.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnChanges {
  @Input() user: User;
  @Output() salva: EventEmitter<any> = new EventEmitter(true);
  @Output() annulla: EventEmitter<any> = new EventEmitter(true);

  form: FormGroup;
  roleList = [];

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.createForm();
  }

  ngOnInit() {
    console.log('EditComponent');
    this.roleList = this.authService.isSuperAdmin() ? ['User', 'Admin'] : ['User'];
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

  salvaEvent(): void {
    const { name, email, password, role } = this.form.value;
    const user: User = { _id: this.user ? this.user._id : null, name, email, password, role };
    this.salva.emit(user);
  }
}

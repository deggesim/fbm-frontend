import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-role-icon',
  templateUrl: './user-role-icon.component.html',
  styleUrls: ['./user-role-icon.component.scss'],
})
export class UserRoleIconComponent {
  @Input() role: string;

  constructor() {}
}

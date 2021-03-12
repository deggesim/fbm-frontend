import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-role-icon',
  templateUrl: './user-role-icon.component.html',
  styleUrls: ['./user-role-icon.component.scss'],
})
export class UserRoleIconComponent implements OnInit {
  @Input() role: string;

  constructor() {}

  ngOnInit() {
    console.log('role', this.role);
  }
}

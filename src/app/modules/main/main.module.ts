import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@app/modules/main/header/header.component';
import { UserProfileComponent } from '@app/modules/main/user-profile/user-profile.component';
import { SharedModule } from '@app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [HeaderComponent, UserProfileComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    // ngx-bootstrap
    CollapseModule,
    BsDropdownModule,
    FontAwesomeModule,
    SharedModule,
    RouterModule,
  ],
  exports: [HeaderComponent, UserProfileComponent],
})
export class MainModule {}

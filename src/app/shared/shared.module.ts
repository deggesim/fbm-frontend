import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { PopupConfermaComponent } from './popup-conferma/popup-conferma.component';
import { UploadComponent } from './upload/upload.component';
import { UserRoleIconComponent } from './user-role-icon/user-role-icon.component';
import { RoleShortPipe } from './role-short.pipe';

@NgModule({
  declarations: [
    PopupConfermaComponent,
    UploadComponent,
    ErrorMessageComponent,
    UserRoleIconComponent,
    RoleShortPipe
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ModalModule,
    TooltipModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    PopupConfermaComponent,
    UploadComponent,
    ErrorMessageComponent,
    UserRoleIconComponent,
    RoleShortPipe
  ]
})
export class SharedModule { }

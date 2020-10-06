import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorMessageComponent } from '@app/shared/components/error-message/error-message.component';
import { PopupConfermaComponent } from '@app/shared/components/popup-conferma/popup-conferma.component';
import { UploadComponent } from '@app/shared/components/upload/upload.component';
import { UserRoleIconComponent } from '@app/shared/components/user-role-icon/user-role-icon.component';
import { RoleShortPipe } from '@app/shared/pipes/role-short.pipe';
import { ToStringPipe } from '@app/shared/pipes/to-string.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PlayerStatusDirective } from './directives/player-status.directive';

@NgModule({
  declarations: [
    ErrorMessageComponent,
    PopupConfermaComponent,
    UploadComponent,
    UserRoleIconComponent,
    RoleShortPipe,
    ToStringPipe,
    PlayerStatusDirective,
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
    RoleShortPipe,
    ToStringPipe,
    PlayerStatusDirective,
  ]
})
export class SharedModule { }

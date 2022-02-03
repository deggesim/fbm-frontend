import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { PlayerStatusDirective } from '@app/shared//directives/player-status.directive';
import { ErrorMessageComponent } from '@app/shared/components/error-message/error-message.component';
import { PopupConfirmComponent } from '@app/shared/components/popup-confirm/popup-confirm.component';
import { UploadComponent } from '@app/shared/components/upload/upload.component';
import { UserRoleIconComponent } from '@app/shared/components/user-role-icon/user-role-icon.component';
import { RoleShortPipe } from '@app/shared/pipes/role-short.pipe';
import { ToStringPipe } from '@app/shared/pipes/to-string.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatchResultComponent } from './components/match-result/match-result.component';
import { DecodeHistoryPipe } from './pipes/decode-history.pipe';

@NgModule({
  declarations: [
    ErrorMessageComponent,
    MatchResultComponent,
    PopupConfirmComponent,
    UploadComponent,
    UserRoleIconComponent,
    RoleShortPipe,
    ToStringPipe,
    PlayerStatusDirective,
    DecodeHistoryPipe,
  ],
  imports: [CommonModule, FontAwesomeModule, ModalModule, TooltipModule, ReactiveFormsModule, FlexLayoutModule],
  exports: [
    ErrorMessageComponent,
    MatchResultComponent,
    PopupConfirmComponent,
    UploadComponent,
    UserRoleIconComponent,
    RoleShortPipe,
    ToStringPipe,
    PlayerStatusDirective,
    DecodeHistoryPipe,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [],
    };
  }
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopupConfermaComponent } from './popup-conferma/popup-conferma.component';
import { UploadComponent } from './upload/upload.component';
import { ErrorMessageComponent } from './error-message/error-message.component';

@NgModule({
  declarations: [
    PopupConfermaComponent,
    UploadComponent,
    ErrorMessageComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    PopupConfermaComponent,
    UploadComponent,
    ErrorMessageComponent
  ]
})
export class SharedModule { }

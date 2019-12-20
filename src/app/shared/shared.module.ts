import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopupConfermaComponent } from './popup-conferma/popup-conferma.component';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  declarations: [
    PopupConfermaComponent,
    UploadComponent
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
    UploadComponent
  ]
})
export class SharedModule { }

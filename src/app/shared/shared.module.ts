import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupConfermaComponent } from './popup-conferma/popup-conferma.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [
    PopupConfermaComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    PopupConfermaComponent
  ]
})
export class SharedModule { }

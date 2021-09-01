import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-popup-conferma',
  templateUrl: './popup-conferma.component.html',
  styleUrls: ['./popup-conferma.component.scss'],
})
export class PopupConfermaComponent {
  @Input() titolo: string;
  @Input() btnConferma: string;
  @Input() btnAnnulla: string;
  @Output() conferma: EventEmitter<any> = new EventEmitter();
  @Output() annulla: EventEmitter<any> = new EventEmitter();

  @ViewChild('modal', { static: false }) private modal: ModalDirective;

  constructor() {}

  apriModale() {
    this.modal.show();
  }

  chiudiModale() {
    this.modal.hide();
  }
}

import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'fbm-popup-confirm',
  templateUrl: './popup-confirm.component.html',
  styleUrls: ['./popup-confirm.component.scss'],
})
export class PopupConfirmComponent {
  @Input() title: string;
  @Input() btnConfirm: string;
  @Input() btnCancel: string;
  @Output() confirm: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  @ViewChild('modal', { static: false }) private modal: ModalDirective;

  openModal() {
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
  }
}

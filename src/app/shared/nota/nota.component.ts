import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-nota',
  templateUrl: './nota.component.html',
  styleUrls: ['./nota.component.scss']
})
export class NotaComponent implements OnInit {

  @Input() type: string;
  @Input() messages: string[];

  classNota: string;
  classIcona: string;

  constructor() { }

  ngOnInit() {
    this.classNota = 'nota-' + (!_.isNil(this.type) ? this.type : 'info');
    switch (this.type) {
      case 'info':
        this.classIcona = 'info-circle';
        break;
      case 'success':
        this.classIcona = 'check-circle ';
        break;
      case 'wait':
        this.classIcona = 'clock-o ';
        break;
      case 'error':
        this.classIcona = 'exclamation-triangle ';
        break;
      case 'warning':
        this.classIcona = 'exclamation-circle';
        break;
      default:
        this.classIcona = 'info-circle';
        break;
    }
  }

}

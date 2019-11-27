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
        this.classIcona = 'fa-info-circle';
        break;
      case 'success':
        this.classIcona = 'fa-check-circle ';
        break;
      case 'wait':
        this.classIcona = 'fa-clock-o ';
        break;
      case 'error':
        this.classIcona = 'fa-exclamation-triangle ';
        break;
      case 'warning':
        this.classIcona = 'fa-exclamation-circle';
        break;
      default:
        this.classIcona = 'fa-info-circle';
        break;
    }
  }

}

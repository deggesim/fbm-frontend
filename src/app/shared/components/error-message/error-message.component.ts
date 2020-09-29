import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('form-group') fg: FormGroup;
  // tslint:disable-next-line: no-input-rename
  @Input('form-control') formControl: FormControl;
  // tslint:disable-next-line: no-input-rename
  @Input('name') formControlName: string;

  constructor() { }

  ngOnInit() {
    // const obs = this.formControl.valueChanges;
    // obs.subscribe(value => {
    //   console.log(value)
    //   console.log('this.formControl.hasError(\'required\')', this.formControl.hasError('required'));
    // });
  }

}

import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
  // tslint:disable-next-line: no-input-rename
  @Input('form-group') fg: FormGroup;
  // tslint:disable-next-line: no-input-rename
  @Input('form-control') formControl: FormControl;
  // tslint:disable-next-line: no-input-rename
  @Input('name') formControlName: string;
}

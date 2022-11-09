import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'fbm-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
  @Input('form-group') fg: FormGroup;
  @Input('form-control') formControl: AbstractControl;
  @Input('name') formControlName: string;
  @Input('custom-message') customMessage: string;
}

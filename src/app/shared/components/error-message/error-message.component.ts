import { Component, Input } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'fbm-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
  @Input('form-group') fg: UntypedFormGroup;
  @Input('form-control') formControl: AbstractControl;
  @Input('name') formControlName: string;
}

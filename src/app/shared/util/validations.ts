import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isEmpty } from 'lodash-es';

export const fantasyTeamMustBeDifferent: ValidatorFn = (fg: AbstractControl): ValidationErrors | null => {
  const fantasyTeam1 = fg.get('fantasyTeam1').value;
  const fantasyTeam2 = fg.get('fantasyTeam2').value;
  if (!isEmpty(fantasyTeam1) && !isEmpty(fantasyTeam2)) {
    const wrongValue = fantasyTeam1._id === fantasyTeam2._id;
    return wrongValue ? { mustBeDifferent: { field1: 'Fantasquadra #1', field2: 'Fantasquadra #2' } } : null;
  } else {
    return null;
  }
};

export const atLeastOne: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (control != null && control.value != null) {
    const wrongValue = control.value.length < 1;
    return wrongValue ? { wrongLength: { value: control.value.length } } : null;
  } else {
    return null;
  }
};

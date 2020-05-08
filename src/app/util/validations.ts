import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
import { isEmpty } from '@app/shared/globals';

export const fantasyTeamMustBeDifferent: ValidatorFn = (fg: FormGroup): { [key: string]: any } | null => {
  const fantasyTeam1 = fg.get('fantasyTeam1').value;
  const fantasyTeam2 = fg.get('fantasyTeam2').value;
  if (!isEmpty(fantasyTeam1) && !isEmpty(fantasyTeam2)) {
    const wrongValue = fantasyTeam1._id === fantasyTeam2._id;
    return wrongValue ? { mustBeDifferent: { field1: 'Fantasquadra #1', field2: 'Fantasquadra #2' } } : null;
  }
};

export const atLeastOne: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
  if (control != null && control.value != null) {
    const wrongValue = control.value.length < 1;
    return wrongValue ? { wrongLength: { value: control.value.length } } : null;
  }
};

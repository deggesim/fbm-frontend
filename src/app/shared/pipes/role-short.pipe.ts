import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '@app/shared/models/player';

@Pipe({
  name: 'roleShort',
})
export class RoleShortPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let ret = '';
    switch (value) {
      case Role.Playmaker:
        ret = 'P';
        break;
      case Role.PlayGuardia:
        ret = 'P/G';
        break;
      case Role.Guardia:
        ret = 'G';
        break;
      case Role.GuardiaAla:
        ret = 'G/A';
        break;
      case Role.Ala:
        ret = 'A';
        break;
      case Role.AlaCentro:
        ret = 'A/C';
        break;
      case Role.Centro:
        ret = 'C';
        break;
      default:
        break;
    }
    return ret;
  }
}

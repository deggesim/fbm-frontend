import { Pipe, PipeTransform } from '@angular/core';
import { FantasyRosterHistory } from '@app/models/fantasy-roster-history';

@Pipe({
  name: 'castToFantasyRosterHistory'
})
export class CastToFantasyRosterHistoryPipe implements PipeTransform {

  transform(value: Object, ...args: unknown[]): FantasyRosterHistory {
    if ('name' in value) {
      return value as FantasyRosterHistory;
    }
    return null;
  }

}

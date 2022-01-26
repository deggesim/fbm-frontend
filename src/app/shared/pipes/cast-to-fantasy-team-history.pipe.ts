import { Pipe, PipeTransform } from '@angular/core';
import { FantasyTeamHistory } from '@app/models/fantasy-team-history';

@Pipe({
  name: 'castToFantasyTeamHistory'
})
export class CastToFantasyTeamHistoryPipe implements PipeTransform {

  transform(value: Object, ...args: unknown[]): FantasyTeamHistory {
    if ('initialBalance' in value) {
      return value as FantasyTeamHistory;
    }
    return null;
  }

}

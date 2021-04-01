import { League, LeagueInfo } from '@app/models/league';
import { User } from '@app/models/user';
import { RouterReducerState } from '@ngrx/router-store';

export interface AppState {
  selectedLeague: League;
  leagueInfo: LeagueInfo;
  user: User;
  router: RouterReducerState;
}

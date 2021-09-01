import { League, LeagueInfo } from '@app/models/league';
import { User } from '@app/models/user';
import { RouterReducerState } from '@ngrx/router-store';
import * as moment from 'moment';

export interface AuthState {
  token: string;
  expiresAt: moment.Moment;
}
export interface AppState {
  auth: AuthState;
  user: User;
  selectedLeague: League;
  leagueInfo: LeagueInfo;
  router: RouterReducerState;
}

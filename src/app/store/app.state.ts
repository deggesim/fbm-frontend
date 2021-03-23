import { LeagueInfo } from '@app/shared/models/league';
import { User } from '@app/shared/models/user';

export interface AppState {
  leagueInfo: LeagueInfo;
  user: User;
}

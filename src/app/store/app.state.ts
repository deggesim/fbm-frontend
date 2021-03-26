import { League, LeagueInfo } from '@app/shared/models/league';
import { User } from '@app/shared/models/user';

export interface AppState {
  selectedLeague: League;
  leagueInfo: LeagueInfo;
  user: User;
}

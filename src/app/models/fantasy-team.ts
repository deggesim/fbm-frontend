import { FantasyRoster } from './fantasy-roster';
import { FbmModel } from './fbm.model';
import { User } from './user';

export interface FantasyTeam extends FbmModel {
  name: string;
  initialBalance?: number;
  outgo?: number;
  totalContracts?: number;
  playersInRoster?: number;
  extraPlayers?: number;
  pointsPenalty?: number;
  balancePenalty?: number;
  owners: User[];
  fantasyRosters?: FantasyRoster[];
}

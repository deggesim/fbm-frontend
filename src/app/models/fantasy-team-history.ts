import { FantasyTeam } from './fantasy-team';
import { FbmModel } from './fbm.model';
import { RealFixture } from './real-fixture';

export interface FantasyTeamHistory extends FbmModel {
  fantasyTeam: FantasyTeam;
  initialBalance?: number;
  outgo?: number;
  totalContracts?: number;
  playersInRoster?: number;
  extraPlayers?: number;
  pointsPenalty?: number;
  balancePenalty?: number;
  realFixture: RealFixture;
}

import { FantasyTeam } from './fantasy-team';
import { FbmModel } from './fbm.model';
import { RealFixture } from './real-fixture';

export interface History extends FbmModel {
  operation: string;
  realFixture: RealFixture;
  fantasyTeam: FantasyTeam;
  balance: number;
  initialBalance: number;
  outgo: number;
  totalContracts: number;
  playersInRoster: number;
  extraPlayers: number;
  pointsPenalty: number;
  balancePenalty: number;
  name: string;
  status: string;
  draft: boolean;
  contract?: number;
  yearContract: number;
  role: string;
}

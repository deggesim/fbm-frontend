import { FantasyTeam } from './fantasy-team';
import { FbmModel } from './fbm.model';
import { RealFixture } from './real-fixture';

export interface FantasyRosterHistory extends FbmModel {
  name: string;
  fantasyTeam: FantasyTeam;
  status: string;
  draft: boolean;
  contract?: number;
  yearContract: number;
  role: string;
  operation: string;
  balance: number;
  realFixture: RealFixture;
}

import { FantasyTeam } from './fantasy-team';
import { FbmModel } from './fbm.model';
import { RealFixture } from './real-fixture';

export interface FantasyTeamHistory extends FbmModel {
  fantasyTeam: FantasyTeam;
  balance?: number;
  operation: string;
  realFixture: RealFixture;
}

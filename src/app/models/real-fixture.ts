import { FbmModel } from './fbm.model';
import { Fixture } from './fixture';
import { Team } from './team';

export interface RealFixture extends FbmModel {
  name: string;
  prepared: boolean;
  fixtures: Fixture[];
  teamsWithNoGame?: Team[];
  order?: number;
}

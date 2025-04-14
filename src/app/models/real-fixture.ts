import { FbmModel } from './fbm.model';
import { Fixture, FixtureWithDetails } from './fixture';
import { Team } from './team';

export interface RealFixture extends FbmModel {
  name: string;
  prepared: boolean;
  fixtures: Fixture[] | FixtureWithDetails[];
  teamsWithNoGame?: Team[];
  order?: number;
}

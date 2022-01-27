import { Competition } from './competition';
import { FantasyTeam } from './fantasy-team';
import { FbmModel } from './fbm.model';
import { Fixture } from './fixture';

export interface Round extends FbmModel {
  name: string;
  completed: boolean;
  homeFactor: number;
  teams: number;
  roundRobin: boolean;
  fantasyTeams: FantasyTeam[];
  fixtures: Fixture[];
  competition: Competition;
}

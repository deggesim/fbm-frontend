import { Competition } from './competition';
import { FantasyTeam } from './fantasy-team';
import { Fixture } from './fixture';

export interface Round {
  _id: string;
  name: string;
  completed: boolean;
  homeFactor: number;
  teams: number;
  roundRobin: boolean;
  fantasyTeams: FantasyTeam[];
  fixtures: Fixture[];
  competition: Competition;
}

import { FantasyRoster } from './fantasy-roster';
import { FbmModel } from './fbm.model';
import { Player } from './player';
import { RealFixture } from './real-fixture';
import { Team } from './team';

export interface Roster extends FbmModel {
  player: Player;
  team: Team;
  realFixture?: RealFixture;
  fantasyRoster?: FantasyRoster;
}

export interface RosterList {
  totalElements: number;
  content: Roster[];
}

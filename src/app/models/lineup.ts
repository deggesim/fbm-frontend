import { FantasyRoster } from './fantasy-roster';
import { Fixture } from './fixture';
import { Performance } from './performance';

export interface Lineup {
  _id?: string;
  fantasyRoster: FantasyRoster;
  spot: number;
  benchOrder: number;
  fixture: Fixture;
  performance?: Performance;
  matchReport?: {
    realRanking: number;
    realRanking40Min: number;
    minutesUsed: number;
  };
}

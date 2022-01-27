import { FantasyRoster } from './fantasy-roster';
import { FbmModel } from './fbm.model';
import { Fixture } from './fixture';
import { Performance } from './performance';

export interface Lineup extends FbmModel {
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

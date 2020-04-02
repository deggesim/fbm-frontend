import { FantasyRoster } from './fantasy-roster';
import { Fixture } from './fixture';

export interface Lineup {
    _id?: string;
    fantasyRoster: FantasyRoster;
    spot: number;
    benchOrder: number;
    fixture: Fixture;
    matchReport?: {
        realRanking: number;
        realRanking40Min: number;
        minutesUsed: number;
    };
}

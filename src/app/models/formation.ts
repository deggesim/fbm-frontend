import { FantasyTeam } from './fantasy-team';
import { Fixture } from './fixture';
import { Player } from './player';

export interface Formation {
    _id: string;
    fantasyTeam: FantasyTeam;
    player: Player;
    spot: number;
    benchOrder: number;
    fixture: Fixture;
    matchReport: {
        realRanking: number;
        realRanking40Min: number;
        minutesUsed: number;
    };
}

import { FantasyRoster } from './fantasy-roster';
import { Player } from './player';
import { RealFixture } from './real-fixture';
import { Team } from './team';

export interface Roster {
    _id?: string;
    player: Player;
    team: Team;
    realFixture?: RealFixture;
    fantasyRoster?: FantasyRoster;
}

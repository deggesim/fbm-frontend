import { CupFormat } from './formats/cup-format';
import { PlayoffFormat } from './formats/playoff-format';
import { PlayoutFormat } from './formats/playout-format';
import { RegularSeasonFormat } from './formats/regular-season-format';
import { Parameter } from './parameter';
import { FantasyTeam } from './fantasy-team';

export interface League {
    _id?: string;
    name: string;
    realGames: number;
    regularSeasonFormat: RegularSeasonFormat;
    playoffFormat: PlayoffFormat;
    playoutFormat: PlayoutFormat;
    cupFormat: CupFormat;
    roundRobinFirstRealFixture: number;
    playoffFirstRealFixture: number;
    playoutFirstRealFixture: number;
    cupFirstRealFixture: number;
    parameters?: Parameter[];
    fantasyTeams?: FantasyTeam[];
}

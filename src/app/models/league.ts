import { RegularSeasonFormat } from './formats/regular-season-format';
import { PlayoffFormat } from './formats/playoff-format';
import { PlayoutFormat } from './formats/playout-format';
import { CupFormat } from './formats/cup-format';

export interface League {
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
}

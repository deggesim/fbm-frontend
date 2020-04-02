import { FantasyRoster } from './fantasy-roster';
import { Lineup } from './lineup';
import { User } from './user';

export interface FantasyTeam {
    _id?: string;
    name: string;
    initialBalance?: number;
    outgo?: number;
    totalContracts?: number;
    playersInRoster?: number;
    extraPlayers?: number;
    pointsPenalty?: number;
    balancePenalty?: number;
    fantasyRosters?: FantasyRoster[];
    lineups?: Lineup[];
    owners: User[];
}

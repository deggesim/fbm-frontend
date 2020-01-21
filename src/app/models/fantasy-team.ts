import { FantasyRoster } from './fantasy-roster';
import { Formation } from './formation';
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
    formations?: Formation[];
    owners: User[];
}

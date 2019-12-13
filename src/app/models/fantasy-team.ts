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
    // formations: Formation[];
    owners: User[];
}

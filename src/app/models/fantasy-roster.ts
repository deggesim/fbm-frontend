import { FantasyTeam } from './fantasy-team';
import { RealFixture } from './real-fixture';
import { Roster } from './roster';
import { Role } from './player';

export interface FantasyRoster {
    _id?: string;
    roster: Roster;
    fantasyTeam: FantasyTeam;
    status: string;
    draft: boolean;
    contract: number;
    yearContract: number;
    realFixture: RealFixture;
}

export enum PlayerStatus {
    'Ext' = 'EXT',
    'Com' = 'COM',
    'Str' = 'STR',
    'Ita' = 'ITA'
}

export const sort = (a: FantasyRoster, b: FantasyRoster): number => {
    const aRole = getRole(a);
    const bRole = getRole(b);
    const map = {};
    map[Role.Playmaker] = 1;
    map[Role.PlayGuardia] = 2;
    map[Role.Guardia] = 3;
    map[Role.GuardiaAla] = 4;
    map[Role.Ala] = 5;
    map[Role.AlaCentro] = 6;
    map[Role.Centro] = 7;

    if (map[aRole] < map[bRole]) {
        return -1;
    } else if (map[aRole] > map[bRole]) {
        return 1;
    } else {
        return a.roster.player.name.localeCompare(b.roster.player.name);
    }
};

function getRole(fantasyRoster: FantasyRoster): Role {
    let role: Role;
    switch (fantasyRoster.roster.player.role) {
        case 'Playmaker':
        case 'Guardia':
        case 'Ala':
        case 'Centro':
            role = Role[fantasyRoster.roster.player.role];
            break;
        case 'Play/Guardia':
            role = Role.PlayGuardia;
            break;
        case 'Guardia/Ala':
            role = Role.GuardiaAla;
            break;
        case 'Ala/Centro':
            role = Role.AlaCentro;
            break;
        default:
            break;
    }
    return role;
}


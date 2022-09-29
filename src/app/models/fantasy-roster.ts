import * as moment from 'moment';
import { FantasyTeam } from './fantasy-team';
import { FbmModel } from './fbm.model';
import { Role } from './player';
import { RealFixture } from './real-fixture';
import { Roster } from './roster';

export interface FantasyRoster extends FbmModel {
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
  'Ita' = 'ITA',
}

export const sortFantasyRoster = (a: FantasyRoster, b: FantasyRoster): number => {
  const aRole = getRole(a);
  const bRole = getRole(b);
  const map: { [x: string]: number } = {};
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
    const isBefore = moment(a.createdAt).isBefore(b.createdAt);
    return isBefore ? -1 : 1;
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

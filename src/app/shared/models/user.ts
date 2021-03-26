import { FantasyTeam } from './fantasy-team';
import { League } from './league';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  tokens?: string[];
  fantasyTeams?: FantasyTeam[];
  leagues?: League[];
}

export enum Role {
  'User' = 'User',
  'Admin' = 'Admin',
  'SuperAdmin' = 'SuperAdmin',
}

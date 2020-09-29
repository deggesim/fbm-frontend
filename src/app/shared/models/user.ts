import { League } from './league';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  leagues?: League[];
  tokens?: string[];
}

export enum Role {
  'User' = 'User',
  'Admin' = 'Admin',
  'SuperAdmin' = 'SuperAdmin',
}

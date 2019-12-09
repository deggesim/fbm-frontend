import { League } from './league';

export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  admin: boolean;
  leagues?: League[];
  tokens?: string[];
}

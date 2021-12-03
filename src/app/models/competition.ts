import { Round } from './round';

export interface Competition {
  _id: string;
  name: string;
  completed: boolean;
  rounds: Round[];
}

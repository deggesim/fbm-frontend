import { FbmModel } from './fbm.model';
import { Round } from './round';

export interface Competition extends FbmModel {
  name: string;
  completed: boolean;
  rounds: Round[];
}

import { FbmModel } from './fbm.model';
import { Match } from './match';
import { RealFixture } from './real-fixture';
import { Round } from './round';

export interface Fixture extends FbmModel {
  name: string;
  unnecessary: boolean;
  completed: boolean;
  matches: Match[];
  round: Round;
  realFixture?: RealFixture;
}

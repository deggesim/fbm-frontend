import { FbmModel } from './fbm.model';
import { Player } from './player';
import { RealFixture } from './real-fixture';

export interface Performance extends FbmModel {
  player: Player;
  realFixture: RealFixture;
  ranking: number;
  minutes: number;
  oer: number;
  plusMinus: number;
  grade: number;
}

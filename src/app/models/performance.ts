import { Player } from './player';
import { RealFixture } from './real-fixture';

export interface Performance {
  _id?: string;
  player: Player;
  realFixture: RealFixture;
  ranking: number;
  minutes: number;
  oer: number;
  plusMinus: number;
  grade: number;
}

import { Performance } from './performance';
import { Player } from './player';

export interface PlayerStats {
  player: Player;
  performanceAvg: number;
  trend: Performance[];
}

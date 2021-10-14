import { Performance } from './performance';
import { Player } from './player';

export interface PlayerStatistic {
  player: Player;
  performances: Performance[];
  team: string;
  fantasyTeam: string;
  status: string;
  avgRanking: number;
  avgMinutes: number;
  avgGrade: number;
  rankingMinutesRatio: number;
}

export interface PlayerStatisticList {
  totalElements: number;
  content: PlayerStatistic[];
}
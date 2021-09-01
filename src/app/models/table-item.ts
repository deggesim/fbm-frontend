import { FantasyTeam } from './fantasy-team';

export interface TableItem {
  fantasyTeam: FantasyTeam;
  points?: number;
  games?: number;
  won?: number;
  lost?: number;
  rankingMade?: number;
  rankingAgainst?: number;
  avarageRankingMade?: number;
  avarageRankingAgainst?: number;
  pointsMade?: number;
  pointsAgainst?: number;
  avaragePointsMade?: number;
  avaragePointsAgainst?: number;
  difference?: number;
  trend?: string;
  trendAvaragePointsMade?: number;
  trendAvaragePointsAgainst?: number;
  turn?: string;
}

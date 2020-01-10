import { FantasyTeam } from './fantasy-team';

export interface Match {
    homeTeam: FantasyTeam;
    awayTeam: FantasyTeam;
    homeRanking: number;
    homeRanking40Min: number;
    awayRanking: number;
    awayRanking40Min: number;
    homeFactor: number;
    homeOer: number;
    awayOer: number;
    homePlusMinus: number;
    awayPlusMinus: number;
    homeGrade: number;
    awayGrade: number;
    overtime: number;
    completed: boolean;
}

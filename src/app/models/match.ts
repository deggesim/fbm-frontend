import { FantasyTeam } from './fantasy-team';

export interface Match {
    _id: string;
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
    homeScore: number;
    awayScore: number;
    overtime: number;
    completed: boolean;
}

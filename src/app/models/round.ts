import { FantasyTeam } from './fantasy-team';
import { Fixture } from './fixture';
import { Match } from './match';

export interface Round {
    _id: string;
    name: string;
    completed: boolean;
    homeFactor: number;
    teams: number;
    roundRobin: boolean;
    fantasyTeams: FantasyTeam[];
    fixtures: Fixture[];
}

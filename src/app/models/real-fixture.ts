import { Fixture } from './fixture';
import { Team } from './team';

export interface RealFixture {
    _id?: string;
    name: string;
    prepared: boolean;
    fixtures: Fixture[];
    teamsWithNoGame?: Team[];
}

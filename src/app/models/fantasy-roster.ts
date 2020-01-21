import { RealFixture } from './real-fixture';
import { Roster } from './roster';

export interface FantasyRoster {
    _id?: string;
    roster: Roster;
    status: string;
    draft: boolean;
    contract: number;
    yearContract: number;
    realFixture: RealFixture;
}

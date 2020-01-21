import { Fixture } from './fixture';

export interface RealFixture {
    _id?: string;
    name: string;
    prepared: boolean;
    fixtures: Fixture[];
}

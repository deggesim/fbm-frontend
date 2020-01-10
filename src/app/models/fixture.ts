import { Match } from './match';

export interface Fixture {
    _id: string;
    name: string;
    unnecessary: boolean;
    completed: boolean;
    matches: Match[];
}

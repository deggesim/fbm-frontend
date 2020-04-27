import { Match } from './match';
import { Round } from './round';

export interface Fixture {
    _id: string;
    name: string;
    unnecessary: boolean;
    completed: boolean;
    matches: Match[];
    round: Round;
}

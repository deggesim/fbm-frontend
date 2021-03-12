import { CupFormat } from './formats/cup-format';
import { PlayoffFormat } from './formats/playoff-format';
import { PlayoutFormat } from './formats/playout-format';
import { RegularSeasonFormat } from './formats/regular-season-format';

export interface League {
  _id?: string;
  name: string;
  realGames: number;
  regularSeasonFormat: RegularSeasonFormat;
  playoffFormat: PlayoffFormat;
  playoutFormat: PlayoutFormat;
  cupFormat: CupFormat;
  roundRobinFirstRealFixture: number;
  playoffFirstRealFixture: number;
  playoutFirstRealFixture: number;
  cupFirstRealFixture: number;
  parameters?: Parameter[];
  roles?: Role[];
}

export interface Role {
  role: string;
  spots: number[];
}

export interface Parameter {
  parameter: string;
  value: number;
}

export enum Status {
  'Preseason' = 'Preseason',
  'RegularSeason' = 'Stagione Regolare',
  'Postseason' = 'Playoff/Playout',
  'Offseason' = 'Offseason',
}

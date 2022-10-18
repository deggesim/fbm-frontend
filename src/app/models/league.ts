import { DateTime } from 'luxon';
import { Fixture } from './fixture';
import { CupFormat } from './formats/cup-format';
import { PlayoffFormat } from './formats/playoff-format';
import { PlayoutFormat } from './formats/playout-format';
import { RegularSeasonFormat } from './formats/regular-season-format';
import { RealFixture } from './real-fixture';

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
  createdAt?: DateTime;
  updatedAt?: DateTime;
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

export interface LeagueInfo {
  info: string;
  status: Status;
  preSeason: boolean;
  regularSeason: boolean;
  postSeason: boolean;
  offSeason: boolean;
  nextRealFixture: RealFixture;
  nextFixture: Fixture;
}

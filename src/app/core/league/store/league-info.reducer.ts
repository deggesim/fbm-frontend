import { LeagueInfo } from '@app/models/league';
import { createReducer, on } from '@ngrx/store';
import * as LeagueInfoActions from './league-info.actions';

const initialState: LeagueInfo = {
  info: '',
  status: null,
  preSeason: false,
  regularSeason: false,
  postSeason: false,
  offSeason: false,
  nextRealFixture: null,
  nextFixture: null,
};

export const leageInfoReducer = createReducer(
  initialState,

  on(LeagueInfoActions.refreshSuccess, (state, action) => ({ ...action.leagueInfo })),
  on(LeagueInfoActions.refreshFailed, (state, action) => ({ ...state })),
  on(LeagueInfoActions.setLeagueInfo, (state, action) => ({ ...action.leagueInfo }))
);

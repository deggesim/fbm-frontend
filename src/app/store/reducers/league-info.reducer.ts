import { LeagueInfo } from '@app/shared/models/league';
import { createReducer, on } from '@ngrx/store';
import * as LeagueInfoActions from '../actions/league-info.actions';

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

  on(LeagueInfoActions.refreshSuccess, (state, action) => {
    return { ...action.leagueInfo };
  }),

  on(LeagueInfoActions.setLeagueInfo, (state, action) => {
    return { ...action.leagueInfo };
  })
);

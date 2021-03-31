import { LeagueInfo } from '@app/shared/models/league';
import { createReducer, on } from '@ngrx/store';
import { refreshSuccess, setLeagueInfo } from '../actions/league-info.actions';

const initialState: LeagueInfo = { info: '', status: null, preSeason: false, regularSeason: false, postSeason: false, offSeason: false };

export const leageInfoReducer = createReducer(
  initialState,

  on(refreshSuccess, (state, action) => {
    return action.leagueInfo;
  }),

  on(setLeagueInfo, (state, action) => {
    return action.leagueInfo;
  })
);

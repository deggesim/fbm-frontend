import { LeagueInfo } from '@app/shared/models/league';
import { createReducer, on } from '@ngrx/store';
import { refreshSuccess } from '../actions/league.actions';

const initialState: LeagueInfo = { info: '', status: null };

export const leageReducer = createReducer(
  initialState,
  on(refreshSuccess, (state, action) => {
    return { ...state, action };
  })
);

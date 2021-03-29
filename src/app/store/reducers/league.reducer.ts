import { League } from '@app/shared/models/league';
import { createReducer, on } from '@ngrx/store';
import { setSelectedLeague } from '../actions/league.actions';

const initialState: League = null;

export const leageReducer = createReducer(
  initialState,

  on(setSelectedLeague, (state, action) => {
    return action.league;
  })
);

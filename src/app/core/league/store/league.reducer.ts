import { League } from '@app/models/league';
import { createReducer, on } from '@ngrx/store';
import * as LeagueActions from './league.actions';

const initialState: League = null;

export const leageReducer = createReducer(
  initialState,

  on(LeagueActions.setSelectedLeague, (state, action) => ({ ...action.league })),
  on(LeagueActions.completePreseasonFailed, (state, action) => ({ ...state }))
);

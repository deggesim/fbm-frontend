import { League } from '@app/shared/models/league';
import { createReducer, on } from '@ngrx/store';
import { setLeagueList } from '../actions/league.actions';

const initialState: League[] = null;

export const leageListReducer = createReducer(
  initialState,

  on(setLeagueList, (state, action) => {
    return { ...state, leagueList: action.leagueList };
  })
);

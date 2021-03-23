import { AppState } from '@app/store/app.state';
import { ActionReducerMap } from '@ngrx/store';
import { leageReducer } from './league.reducer';
import { userReducer } from './user.reducer';

export const reducers: ActionReducerMap<AppState> = {
  leagueInfo: leageReducer,
  user: userReducer,
};

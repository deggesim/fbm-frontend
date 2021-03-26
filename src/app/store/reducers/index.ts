import { AppState } from '@app/store/app.state';
import { ActionReducerMap } from '@ngrx/store';
import { leageInfoReducer } from './league-info.reducer';
import { leageReducer } from './league.reducer';
import { userReducer } from './user.reducer';

export const reducers: ActionReducerMap<AppState> = {
  selectedLeague: leageReducer,
  leagueInfo: leageInfoReducer,
  user: userReducer,
};

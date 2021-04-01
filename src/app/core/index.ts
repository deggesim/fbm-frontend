import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { leageInfoReducer } from './league/store/league-info.reducer';
import { leageReducer } from './league/store/league.reducer';
import { userReducer } from './user/store/user.reducer';

export const reducers: ActionReducerMap<AppState> = {
  selectedLeague: leageReducer,
  leagueInfo: leageInfoReducer,
  user: userReducer,
  router: routerReducer
};

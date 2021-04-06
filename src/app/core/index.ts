import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from './auth/store/auth.reducer';
import { leageInfoReducer } from './league/store/league-info.reducer';
import { leageReducer } from './league/store/league.reducer';
import { userReducer } from './user/store/user.reducer';

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  user: userReducer,
  selectedLeague: leageReducer,
  leagueInfo: leageInfoReducer,
  router: routerReducer
};

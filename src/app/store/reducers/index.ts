import { AppState } from '@app/store/app.state';
import { ActionReducerMap } from '@ngrx/store';
import { leageInfoReducer } from './league-info.reducer';
import { leageListReducer } from './league-list.reducer';
import { leageReducer } from './league.reducer';
import { userReducer } from './user.reducer';

export const reducers: ActionReducerMap<AppState> = {
  leagueList: leageListReducer,
  selectedLeague: leageReducer,
  leagueInfo: leageInfoReducer,
  user: userReducer,
};

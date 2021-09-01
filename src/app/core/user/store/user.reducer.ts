import { User } from '@app/models/user';
import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';

const initialState: User = null;

export const userReducer = createReducer(
  initialState,

  on(UserActions.loadUserSuccess, (state, action) => ({ ...action.user })),
  on(UserActions.loadUserFailed, (state, action) => ({ ...state })),
  on(UserActions.saveUserSuccess, (state, action) => ({ ...action.user })),
  on(UserActions.saveUserFailed, (state, action) => ({ ...state })),
  on(UserActions.setUser, (state, action) => ({ ...action.user })),
);

import { User } from '@app/models/user';
import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';

const initialState: User = null;

export const userReducer = createReducer(
  initialState,

  on(UserActions.setUser, (state, action) => {
    return { ...action.user };
  }),

  on(UserActions.loginSuccess, (state, action) => {
    return { ...action.user };
  }),

  on(UserActions.loginFailed, (state, action) => {
    return { ...state };
  }),

  on(UserActions.logoutSuccess, (state, action) => {
    return null;
  })
);

import { User } from '@app/shared/models/user';
import { createReducer, on } from '@ngrx/store';
import { loginFailed, loginSuccess, logoutSuccess, setUser } from '../actions/user.actions';

const initialState: User = null;

export const userReducer = createReducer(
  initialState,

  on(setUser, (state, action) => {
    return { ...action.user };
  }),

  on(loginSuccess, (state, action) => {
    return { ...action.user };
  }),

  on(loginFailed, (state, action) => {
    return { ...state };
  }),

  on(logoutSuccess, (state, action) => {
    return null;
  })
);

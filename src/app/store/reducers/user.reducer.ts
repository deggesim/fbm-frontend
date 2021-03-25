import { User } from '@app/shared/models/user';
import { createReducer, on } from '@ngrx/store';
import { loginFailed, loginSuccess, logoutSuccess } from '../actions/user.actions';

const initialState: User = null;

export const userReducer = createReducer(
  initialState,

  on(loginSuccess, (state, action) => {
    return { ...state, user: action.user };
  }),

  on(loginFailed, (state, action) => {
    return { ...state  };
  }),

  on(logoutSuccess, (state, action) => {
    return { ...state, user: null };
  }),
);

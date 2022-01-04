import { AuthState } from '@app/core/app.state';
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export const initialState: AuthState = { token: null, expiresAt: null };

export const authReducer = createReducer(
  initialState,
  on(AuthActions.setAuth, (state, action) => ({ ...action.auth })),
  on(AuthActions.loginSuccess, (state, action) => ({ ...action.auth })),
  on(AuthActions.loginFailed, (state) => ({ ...state })),
  on(AuthActions.logoutSuccess, (state) => ({ token: null, expiresAt: null }))
);
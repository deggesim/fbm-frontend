import { AuthState } from '@app/core/app.state';
import { Login } from '@app/models/user';
import { createAction, props } from '@ngrx/store';

export const login = createAction('[Auth] login', props<{ login: Login }>());
export const loginSuccess = createAction('[Auth] login success', props<{ auth: AuthState }>());
export const loginFailed = createAction('[Auth] login failed');

export const logout = createAction('[Auth] logout');
export const logoutSuccess = createAction('[Auth] logout success');

export const setAuth = createAction('[Auth] save', props<{ auth: AuthState }>());

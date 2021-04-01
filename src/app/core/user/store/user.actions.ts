import { Login } from '@app/models/login';
import { User } from '@app/models/user';
import { createAction, props } from '@ngrx/store';

export const initUser = createAction('[User] init');
export const setUser = createAction('[User] set user', props<{ user: User }>());

export const login = createAction('[User] login', props<{ user: Login }>());
export const loginSuccess = createAction('[User] login success', props<{ user: User }>());
export const loginFailed = createAction('[User] login failed');

export const logout = createAction('[User] logout');
export const logoutSuccess = createAction('[User] logout success');

export const saveUser = createAction('[User] save user', props<{ user: User }>());
export const saveUserSuccess = createAction('[User] save user success', props<{ user: User }>());
export const saveUserFailed = createAction('[User] save user failed');

export const getUser = createAction('[User] get user');
export const getUserSuccess = createAction('[User] get user success', props<{ user: User }>());
export const getUserFailed = createAction('[User] get user failed');

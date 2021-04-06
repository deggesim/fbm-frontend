import { User } from '@app/models/user';
import { createAction, props } from '@ngrx/store';

export const loadUser = createAction('[User] load user');
export const loadUserSuccess = createAction('[User] load user success', props<{ user: User }>());
export const loadUserFailed = createAction('[User] load user failed');

export const saveUser = createAction('[User] save user', props<{ user: User }>());
export const saveUserSuccess = createAction('[User] save user success', props<{ user: User }>());
export const saveUserFailed = createAction('[User] save user failed');


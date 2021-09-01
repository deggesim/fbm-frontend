import { AppState, AuthState } from '@app/core/app.state';
import { createSelector } from '@ngrx/store';

export const selectAuth = (state: AppState) => state.auth;

export const getToken = createSelector(selectAuth, (state: AuthState) => state.token);
export const getExpiresAt = createSelector(selectAuth, (state: AuthState) => state.expiresAt);

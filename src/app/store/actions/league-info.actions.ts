import { LeagueInfo } from '@app/shared/models/league';
import { createAction, props } from '@ngrx/store';

export const refresh = createAction('[League Info] refresh');

export const refreshSuccess = createAction('[League Info] refresh success', props<{ leagueInfo: LeagueInfo }>());

export const refreshFailed = createAction('[League Info] refresh failed');

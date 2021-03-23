import { LeagueInfo } from '@app/shared/models/league';
import { createAction, props } from '@ngrx/store';

export const refresh = createAction('[League] refresh');

export const refreshSuccess = createAction('[League] refresh success', props<{ leagueInfo: LeagueInfo }>());

export const refreshFailed = createAction('[League] refresh failed');

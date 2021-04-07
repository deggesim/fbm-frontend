import { League, LeagueInfo } from '@app/models/league';
import { createAction, props } from '@ngrx/store';

export const refresh = createAction('[League Info] refresh', props<{ league: League }>());
export const refreshSuccess = createAction('[League Info] refresh success', props<{ leagueInfo: LeagueInfo }>());
export const refreshFailed = createAction('[League Info] refresh failed');

export const setLeagueInfo = createAction('[League Info] set league info', props<{ leagueInfo: LeagueInfo }>());

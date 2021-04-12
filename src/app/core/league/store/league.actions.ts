import { FantasyTeam } from '@app/models/fantasy-team';
import { League } from '@app/models/league';
import { createAction, props } from '@ngrx/store';

export const selectLeague = createAction('[League] select league', props<{ league: League }>());
export const setSelectedLeague = createAction('[League] set selected league', props<{ league: League }>());

export const createLeague = createAction('[League] create league', props<{ league: League; fantasyTeams: FantasyTeam[] }>());
export const createLeagueSuccess = createAction('[League] create league success', props<{ league: League }>());
export const createLeagueFailed = createAction('[League] create league failed');

export const editLeague = createAction('[League] edit league', props<{ league: League }>());
export const editLeagueSuccess = createAction('[League] edit league success', props<{ league: League }>());
export const editLeagueFailed = createAction('[League] edit league failed');

export const editParameters = createAction('[League] edit parameters', props<{ parameters: { parameter: string; value: string }[] }>());
export const editParametersSuccess = createAction('[League] edit parameters success', props<{ league: League }>());
export const editParametersFailed = createAction('[League] edit parameters failed');

export const editRoles = createAction('[League] edit roles', props<{ roles: { role: string; spots: number[] }[] }>());
export const editRolesSuccess = createAction('[League] edit roles success', props<{ league: League }>());
export const editRolesFailed = createAction('[League] edit roles failed');

export const completePreseason = createAction('[League] complete pre season');
export const completePreseasonSuccess = createAction('[League] complete pre season success', props<{ league: League }>());
export const completePreseasonFailed = createAction('[League] complete pre season failed');

import { League } from '@app/models/league';
import { createAction, props } from '@ngrx/store';

export const selectLeague = createAction('[League] select league', props<{ league: League }>());
export const setSelectedLeague = createAction('[League] set selected league', props<{ league: League }>());

export const completePreseason = createAction('[League] complete pre season');
export const completePreseasonSuccess = createAction('[League] complete pre season success', props<{ league: League }>());
export const completePreseasonFailed = createAction('[League] complete pre season failed');

export const editLeague = createAction('[League] edit league', props<{ league: League }>());
export const editLeagueSuccess = createAction('[League] edit league success', props<{ league: League }>());
export const editLeagueFailed = createAction('[League] edit league failed');

export const editParameters = createAction('[League] edit parameters', props<{ parameters: { parameter: string, value: string }[] }>());
export const editParametersSuccess = createAction('[League] edit parameters success', props<{ league: League }>());
export const editParametersFailed = createAction('[League] edit parameters failed');

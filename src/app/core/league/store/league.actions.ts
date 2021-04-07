import { League } from '@app/models/league';
import { createAction, props } from '@ngrx/store';

export const selectLeague = createAction('[League] select league', props<{ league: League }>());
export const setSelectedLeague = createAction('[League] set selected league', props<{ league: League }>());
export const completePreseason = createAction('[League] complete pre season');
export const completePreseasonSuccess = createAction('[League] complete pre season success', props<{ league: League }>());
export const completePreseasonFailed = createAction('[League] complete pre season failed');

import { League } from '@app/models/league';
import { createAction, props } from '@ngrx/store';

export const setSelectedLeague = createAction('[League] set selected league', props<{ league: League }>());
export const completePreseason = createAction('[League] complete pre season');

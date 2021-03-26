import { League } from '@app/shared/models/league';
import { createAction, props } from '@ngrx/store';

export const initLeague = createAction('[League] init');
export const setSelectedLeague = createAction('[League] set selected league', props<{ league: League }>());

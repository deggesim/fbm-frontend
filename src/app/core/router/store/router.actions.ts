import { createAction, props } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';
import { LeagueInfo } from '@app/models/league';

export const go = createAction('[Router] go', props<{ path: any[]; extras?: NavigationExtras }>());
export const back = createAction('[Router] back');
export const forward = createAction('[Router] forward');
export const redirectAfterSelectLeague = createAction('[Router] redirect after select league');

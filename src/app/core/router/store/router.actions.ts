import { createAction, props } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

export const go = createAction('[ROUTER] go', props<{ path: any[]; extras?: NavigationExtras }>());

export const back = createAction('[ROUTER] back');
export const forward = createAction('[ROUTER] forward');

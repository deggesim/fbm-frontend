import { AppState } from '@app/core/app.state';
import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector } from '@ngrx/store';

export const selectRouter = createFeatureSelector< RouterReducerState>('router');

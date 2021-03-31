import { Injectable } from '@angular/core';
import { LeagueInfo } from '@app/shared/models/league';
import { LeagueService } from '@app/shared/services/league.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as LeagueInfoActions from '../actions/league-info.actions';
import { AppState } from '../app.state';
import { selectedLeague } from '../selectors/league.selector';

@Injectable()
export class LeagueInfoEffects {
  constructor(private actions$: Actions, private store: Store<AppState>, private leagueService: LeagueService) {}

  refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueInfoActions.refresh),
      withLatestFrom(this.store.pipe(select(selectedLeague))),
      switchMap(([action, selectedLeague]) =>
        this.leagueService.refresh$(selectedLeague).pipe(
          map((leagueInfo: LeagueInfo) => LeagueInfoActions.refreshSuccess({ leagueInfo })),
          catchError(() => of(LeagueInfoActions.refreshFailed()))
        )
      )
    )
  );
}

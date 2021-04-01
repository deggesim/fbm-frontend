import { Injectable } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { LeagueService } from '@app/core/league/services/league.service';
import { LeagueInfo } from '@app/models/league';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as LeagueInfoActions from './league-info.actions';
import { selectedLeague } from './league.selector';

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

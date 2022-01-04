import { Injectable } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { LeagueService } from '@app/core/league/services/league.service';
import { LocalStorageService } from '@app/core/local-storage.service';
import { League, LeagueInfo } from '@app/models/league';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';
import * as LeagueInfoActions from './league-info.actions';
import { selectedLeague } from './league.selector';

@Injectable()
export class LeagueInfoEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private leagueService: LeagueService,
    private localStorageService: LocalStorageService
  ) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      mapTo(this.localStorageService.getSelectedLeague()),
      filter((league: League) => !!league),
      switchMap((league: League) =>
        this.leagueService.refresh$(league).pipe(
          map((leagueInfo: LeagueInfo) => LeagueInfoActions.refreshSuccess({ leagueInfo })),
          catchError(() => of(LeagueInfoActions.refreshFailed()))
        )
      )
    )
  );

  refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueInfoActions.refresh),
      withLatestFrom(this.store.pipe(select(selectedLeague))),
      switchMap(([action, sl]) =>
        this.leagueService.refresh$(sl).pipe(
          map((leagueInfo: LeagueInfo) => LeagueInfoActions.refreshSuccess({ leagueInfo })),
          catchError(() => of(LeagueInfoActions.refreshFailed()))
        )
      )
    )
  );
}

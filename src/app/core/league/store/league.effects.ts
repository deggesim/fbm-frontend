import { Injectable } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { LocalStorageService } from '@app/core/local-storage.service';
import * as RouterActions from '@app/core/router/store/router.actions';
import { League, LeagueInfo } from '@app/models/league';
import { ToastService } from '@app/shared/services/toast.service';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, mapTo, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { LeagueService } from '../services/league.service';
import * as LeagueInfoActions from './league-info.actions';
import * as LeagueActions from './league.actions';
import { selectedLeague } from './league.selector';

@Injectable()
export class LeagueEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private leagueService: LeagueService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService
  ) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      mapTo(this.localStorageService.getSelectedLeague()),
      // we want dispatch an action only when selectedLeague is in localStorage
      filter((league: League) => !!league),
      map((league: League) => LeagueActions.setSelectedLeague({ league }))
    )
  );

  selectLeague$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.selectLeague),
      switchMap(({ league }) =>
        this.leagueService.refresh$(league).pipe(
          switchMap((leagueInfo: LeagueInfo) => [
            LeagueActions.setSelectedLeague({ league }),
            LeagueInfoActions.refreshSuccess({ leagueInfo }),
            RouterActions.redirectAfterSelectLeague(),
          ]),
          tap(() => {
            this.localStorageService.setSelectedLeague(league);
          }),
          catchError(() => of(LeagueInfoActions.refreshFailed()))
        )
      )
    )
  );

  completePreseason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.completePreseason),
      withLatestFrom(this.store.pipe(select(selectedLeague))),
      switchMap(([action, league]) =>
        this.leagueService.completePreseason(league._id).pipe(
          map((league: League) => LeagueActions.completePreseasonSuccess({ league })),
          tap(() => {
            const title = 'Presason completata';
            const message = 'Il torneo ora è nella fase "Stagione regolare"';
            this.toastService.success(title, message);
          }),
          catchError(() => of(LeagueActions.completePreseasonFailed()))
        )
      )
    )
  );

  completePreseasonSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.completePreseasonSuccess),
      switchMap(({ league }) => [LeagueInfoActions.refresh({ league }), RouterActions.go({ path: ['home'] })])
    )
  );
}

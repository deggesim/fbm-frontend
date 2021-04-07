import { Injectable } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { LocalStorageService } from '@app/core/local-storage.service';
import { go } from '@app/core/router/store/router.actions';
import { League, LeagueInfo } from '@app/models/league';
import { ToastService } from '@app/shared/services/toast.service';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
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
      tap((league: League) => {
        this.leagueService.refresh$(league).pipe(
          map((leagueInfo: LeagueInfo) => LeagueInfoActions.refreshSuccess({ leagueInfo })),
          catchError(() => of(LeagueInfoActions.refreshFailed()))
        );
      }),
      map((league: League) => LeagueActions.setSelectedLeague({ league }))
    )
  );

  setSelectedLeague$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LeagueActions.setSelectedLeague),
        tap(({ league }) => {
          this.localStorageService.setSelectedLeague(league);
        })
      ),
    { dispatch: false }
  );

  completePreseason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.completePreseason),
      withLatestFrom(this.store.pipe(select(selectedLeague))),
      switchMap(([action, league]) => this.leagueService.completePreseason(league._id)),
      map((league: League) => LeagueInfoActions.refresh({ league })),
      tap(() => {
        const title = 'Presason completata';
        const message = 'Il torneo ora è nella fase "Stagione regolare"';
        this.toastService.success(title, message);
      }),
      mapTo(go({ path: ['/home'] }))
    )
  );
}

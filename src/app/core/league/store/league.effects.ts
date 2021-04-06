import { Injectable } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { LocalStorageService } from '@app/core/local-storage.service';
import { go } from '@app/core/router/store/router.actions';
import { user } from '@app/core/user/store/user.selector';
import { League } from '@app/models/league';
import { ToastService } from '@app/shared/services/toast.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { mapTo, switchMap, tap, withLatestFrom } from 'rxjs/operators';
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

  initLeague$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.initLeague),
      withLatestFrom(this.store.pipe(select(user))),
      switchMap(([action, user]) => {
        const selectedLeague = this.localStorageService.getSelectedLeague();
        const leagueList = user.leagues;
        const leagueFound = leagueList.find((league: League) => league._id === selectedLeague?._id);
        if (leagueFound != null) {
          return [LeagueActions.setSelectedLeague({ league: leagueFound }), LeagueInfoActions.refresh()];
        }
      }),
      tap(() => LeagueInfoActions.refresh())
    )
  );

  completePreseason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.completePreseason),
      withLatestFrom(this.store.pipe(select(selectedLeague))),
      switchMap(([action, league]) => this.leagueService.completePreseason(league._id)),
      mapTo(LeagueInfoActions.refresh()),
      tap(() => {
        const title = 'Presason completata';
        const message = 'Il torneo ora è nella fase "Stagione regolare"';
        this.toastService.success(title, message);
      }),
      mapTo(go({ path: ['/home'] }))
    )
  );
}

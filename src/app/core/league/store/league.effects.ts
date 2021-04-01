import { Injectable } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { AuthService } from '@app/core/user/services/auth.service';
import { user } from '@app/core/user/store/user.selector';
import { League } from '@app/models/league';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { isEmpty } from 'lodash-es';
import { of } from 'rxjs';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { LeagueService } from '../services/league.service';
import * as LeagueInfoActions from './league-info.actions';
import * as LeagueActions from './league.actions';

@Injectable()
export class LeagueEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store<AppState>,
    private leagueService: LeagueService
  ) {}

  initLeague$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.initLeague),
      withLatestFrom(this.store.pipe(select(user))),
      switchMap(([action, user]) => {
        if (this.authService.isLoggedIn()) {
          const selectedLeague = this.leagueService.getSelectedLeague();
          const leagueList = user.leagues;
          const leagueFound = leagueList.find((league: League) => league._id === selectedLeague?._id);
          if (leagueFound != null) {
            return of(LeagueActions.setSelectedLeague({ league: leagueFound }));
          } else if (leagueList != null && !isEmpty(leagueList)) {
            return of(LeagueActions.setSelectedLeague({ league: leagueList[0] }));
          }
        } else {
          return of(LeagueActions.setSelectedLeague(null));
        }
      }),
      tap(() => LeagueInfoActions.refresh())
    )
  );
}

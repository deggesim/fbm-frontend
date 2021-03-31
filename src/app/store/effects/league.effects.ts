import { Injectable } from '@angular/core';
import { League } from '@app/shared/models/league';
import { AuthService } from '@app/shared/services/auth.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { isEmpty } from 'lodash-es';
import { of } from 'rxjs';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { refresh } from '../actions/league-info.actions';
import * as leagueActions from '../actions/league.actions';
import { AppState } from '../app.state';
import { user } from '../selectors/user.selector';

@Injectable()
export class LeagueEffects {
  constructor(private actions$: Actions, private authService: AuthService, private store: Store<AppState>) {}

  initLeague$ = createEffect(() =>
    this.actions$.pipe(
      ofType(leagueActions.initLeague),
      withLatestFrom(this.store.pipe(select(user))),
      switchMap(([action, user]) => {
        if (this.authService.isLoggedIn()) {
          const selectedLeague = JSON.parse(localStorage.getItem('league'));
          const leagueList = user.leagues;
          const leagueFound = leagueList.find((league: League) => league._id === selectedLeague?._id);
          if (leagueFound != null) {
            return of(leagueActions.setSelectedLeague({ league: leagueFound }));
          } else if (leagueList != null && !isEmpty(leagueList)) {
            return of(leagueActions.setSelectedLeague({ league: leagueList[0] }));
          }
        } else {
          return of(leagueActions.setSelectedLeague(null));
        }
      }),
      tap(() => refresh())
    )
  );
}

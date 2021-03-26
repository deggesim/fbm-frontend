import { Injectable } from '@angular/core';
import { League } from '@app/shared/models/league';
import { AuthService } from '@app/shared/services/auth.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { isEmpty } from 'lodash-es';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { refresh } from '../actions/league-info.actions';
import { initLeague, setSelectedLeague } from '../actions/league.actions';

@Injectable()
export class LeagueEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  initLeague$ = createEffect(() =>
    this.actions$.pipe(
      ofType(initLeague),
      switchMap(() => {
        if (this.authService.isLoggedIn()) {
          const selectedLeague = JSON.parse(localStorage.getItem('league'));
          const userLogged = this.authService.getLoggedUser();
          const leagueList = userLogged.leagues;
          const leagueFound = leagueList.find((league: League) => league._id === selectedLeague._id);
          if (leagueFound != null) {
            return of(setSelectedLeague({ league: leagueFound }));
          } else if (leagueList != null && !isEmpty(leagueList)) {
            return of(setSelectedLeague({ league: leagueList[0] }));
          }
        } else {
          return of(setSelectedLeague(null));
        }
      }),
      tap(() => refresh())
    )
  );
}

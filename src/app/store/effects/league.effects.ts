import { Injectable } from '@angular/core';
import { Status } from '@app/shared/models/league';
import { LeagueService } from '@app/shared/services/league.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, merge, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { refresh, refreshFailed, refreshSuccess } from '../actions/league.actions';
import { AppState } from '../app.state';

@Injectable()
export class LeagueEffects {
  constructor(private actions$: Actions, private store: Store<AppState>, private leagueService: LeagueService) {}

  refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(refresh),
      switchMap(() =>
        this.leagueService.refresh.pipe(
          map((values: any[]) => {
            let nextFixture = '';
            for (const fixture of values[3].fixtures) {
              nextFixture += ` - ${fixture.round.name} ${fixture.name}`;
            }

            let info: string;
            let status: Status;
            const league = this.leagueService.getSelectedLeague();
            const leagueName = league != null ? league.name : '';
            if (values[0]) {
              info = `${leagueName} - ${Status.Preseason}`;
              status = Status.Preseason;
            } else if (values[1]) {
              info = `${leagueName} - ${Status.Offseason}`;
              status = Status.Offseason;
            } else if (values[2]) {
              info = `${leagueName} ${nextFixture}`;
              status = Status.Postseason;
            } else {
              info = `${leagueName} ${nextFixture}`;
              status = Status.RegularSeason;
            }
            return refreshSuccess({ leagueInfo: { info, status } });
          }),
          catchError(() => of(refreshFailed()))
        )
      )
    )
  );
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fixture } from '@app/shared/models/fixture';
import { League, Status } from '@app/shared/models/league';
import { RealFixture } from '@app/shared/models/real-fixture';
import { LeagueService } from '@app/shared/services/league.service';
import { environment } from '@env/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { refresh, refreshFailed, refreshSuccess } from '../actions/league-info.actions';
import { AppState } from '../app.state';
import { selectedLeague } from '../selectors/league.selector';

@Injectable()
export class LeagueInfoEffects {
  constructor(private actions$: Actions, private store: Store<AppState>, private http: HttpClient, private leagueService: LeagueService) {}

  private endpoint = environment.endpoint;

  refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(refresh),
      withLatestFrom(this.store.pipe(select(selectedLeague))),
      mergeMap(([action, selectedLeague]) =>
        forkJoin([
          this.http.get<Fixture>(`${this.endpoint}/leagues/${selectedLeague._id}/next-fixture`),
          this.http.get<RealFixture>(`${this.endpoint}/leagues/${selectedLeague._id}/next-realfixture`),
          this.http.get<boolean>(`${this.endpoint}/leagues/${selectedLeague._id}/is-preseason`),
          this.http.get<boolean>(`${this.endpoint}/leagues/${selectedLeague._id}/is-offseason`),
        ]).pipe(
          map((values: any[]) => {
            let nextFixture = '';
            for (const fixture of values[3].fixtures) {
              nextFixture += ` - ${fixture.round.name} ${fixture.name}`;
            }

            let info: string;
            let status: Status;
            const leagueName = selectedLeague != null ? selectedLeague.name : '';
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fixture } from '@app/shared/models/fixture';
import { League } from '@app/shared/models/league';
import { RealFixture } from '@app/shared/models/real-fixture';
import { selectedLeague } from '@app/store/selectors/league.selector';
import { environment } from '@env/environment';
import { select, Store } from '@ngrx/store';
import { EMPTY, forkJoin, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LeagueService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient, private store: Store) {}

  public nextFixture(): Observable<Fixture> {
    return this.store.pipe(
      select(selectedLeague),
      concatMap((selectedLeague: League) =>
        selectedLeague != null ? this.http.get<Fixture>(`${this.endpoint}/leagues/${selectedLeague._id}/next-fixture`) : EMPTY
      )
    );
  }

  public nextRealFixture(): Observable<RealFixture> {
    return this.store.pipe(
      select(selectedLeague),
      concatMap((selectedLeague: League) =>
        selectedLeague != null ? this.http.get<RealFixture>(`${this.endpoint}/leagues/${selectedLeague._id}/next-realfixture`) : EMPTY
      )
    );
  }

  public isPreseason(): Observable<boolean> {
    return this.store.pipe(
      select(selectedLeague),
      concatMap((selectedLeague: League) =>
        selectedLeague != null ? this.http.get<boolean>(`${this.endpoint}/leagues/${selectedLeague._id}/is-preseason`) : EMPTY
      )
    );
  }

  public isOffseason(): Observable<boolean> {
    return this.store.pipe(
      select(selectedLeague),
      concatMap((selectedLeague: League) =>
        selectedLeague != null ? this.http.get<boolean>(`${this.endpoint}/leagues/${selectedLeague._id}/is-offseason`) : EMPTY
      )
    );
  }

  public isPostSeason(): Observable<boolean> {
    return this.store.pipe(
      select(selectedLeague),
      concatMap((selectedLeague: League) =>
        selectedLeague != null ? this.http.get<boolean>(`${this.endpoint}/leagues/${selectedLeague._id}/is-postseason`) : EMPTY
      )
    );
  }
}

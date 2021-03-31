import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fixture } from '@app/shared/models/fixture';
import { League, LeagueInfo, Status } from '@app/shared/models/league';
import { RealFixture } from '@app/shared/models/real-fixture';
import { AppState } from '@app/store/app.state';
import { environment } from '@env/environment';
import { Store } from '@ngrx/store';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LeagueService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  public refresh$ = (league: League): Observable<LeagueInfo> =>
    forkJoin([this.isPreSeason(league), this.isOffSeason(league), this.isPostSeason(league), this.nextRealFixture(league), this.nextRealFixture(league)]).pipe(
      map((values: any[]) => {
        let nextFixture = '';
        for (const fixture of values[3].fixtures) {
          nextFixture += ` - ${fixture.round.name} ${fixture.name}`;
        }

        let info: string;
        let status: Status;
        let preSeason = false;
        let regularSeason = false;
        let postSeason = false;
        let offSeason = false;
        const leagueName = league != null ? league.name : '';
        if (values[0]) {
          info = `${leagueName} - ${Status.Preseason}`;
          status = Status.Preseason;
          preSeason = true;
        } else if (values[1]) {
          info = `${leagueName} - ${Status.Offseason}`;
          status = Status.Offseason;
          offSeason = true;
        } else if (values[2]) {
          info = `${leagueName} ${nextFixture}`;
          status = Status.Postseason;
          postSeason = true;
        } else {
          info = `${leagueName} ${nextFixture}`;
          status = Status.RegularSeason;
          regularSeason = true;
        }
        const leagueInfo: LeagueInfo = { info, status, preSeason, regularSeason, postSeason, offSeason };
        return leagueInfo;
      })
    );

  public nextFixture(league: League): Observable<Fixture> {
    return league ? this.http.get<Fixture>(`${this.endpoint}/leagues/${league._id}/next-fixture`) : EMPTY;
  }

  public nextRealFixture(league: League): Observable<RealFixture> {
    return league ? this.http.get<RealFixture>(`${this.endpoint}/leagues/${league._id}/next-realfixture`) : EMPTY;
  }

  private isPreSeason(league: League): Observable<boolean> {
    return league ? this.http.get<boolean>(`${this.endpoint}/leagues/${league._id}/is-preseason`) : of(false);
  }

  private isOffSeason(league: League): Observable<boolean> {
    return league ? this.http.get<boolean>(`${this.endpoint}/leagues/${league._id}/is-offseason`) : of(false);
  }

  private isPostSeason(league: League): Observable<boolean> {
    return league ? this.http.get<boolean>(`${this.endpoint}/leagues/${league._id}/is-postseason`) : of(false);
  }
}

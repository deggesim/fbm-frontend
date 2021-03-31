import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fixture } from '@app/shared/models/fixture';
import { League, LeagueInfo, Status } from '@app/shared/models/league';
import { RealFixture } from '@app/shared/models/real-fixture';
import { environment } from '@env/environment';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LeagueService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public refresh$ = (league: League): Observable<LeagueInfo> =>
    forkJoin([
      this.isPreSeason(league),
      this.isOffSeason(league),
      this.isPostSeason(league),
      this.nextRealFixture(league),
      this.nextFixture(league),
    ]).pipe(
      map((values: any[]) => {
        const nextRealFixture = values[3];
        const nextFixture = values[4];
        let nextFixtureName = '';
        for (const fixture of nextRealFixture.fixtures) {
          nextFixtureName += ` - ${fixture.round.name} ${fixture.name}`;
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
          info = `${leagueName} ${nextFixtureName}`;
          status = Status.Postseason;
          postSeason = true;
        } else {
          info = `${leagueName} ${nextFixtureName}`;
          status = Status.RegularSeason;
          regularSeason = true;
        }
        const leagueInfo: LeagueInfo = { info, status, preSeason, regularSeason, postSeason, offSeason, nextRealFixture, nextFixture };
        return leagueInfo;
      })
    );

  public setSelectedLeague(league: League) {
    localStorage.setItem('league', JSON.stringify(league));
  }

  public getSelectedLeague() {
    return JSON.parse(localStorage.getItem('league'));
  }

  private nextFixture(league: League): Observable<Fixture> {
    return league ? this.http.get<Fixture>(`${this.endpoint}/leagues/${league._id}/next-fixture`) : EMPTY;
  }

  private nextRealFixture(league: League): Observable<RealFixture> {
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

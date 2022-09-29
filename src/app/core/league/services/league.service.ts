import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fixture } from '@app/models/fixture';
import { League, LeagueInfo, Status } from '@app/models/league';
import { RealFixture } from '@app/models/real-fixture';
import { environment } from '@env/environment';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LeagueService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public create(league: League) {
    return this.http.post<League>(`${this.endpoint}/leagues`, league);
  }

  public all() {
    return this.http.get<League[]>(`${this.endpoint}/leagues`);
  }

  public read(leagueId: string) {
    return this.http.get<League>(`${this.endpoint}/leagues/${leagueId}`);
  }

  public update(league: League) {
    return this.http.patch<League>(`${this.endpoint}/leagues/${league._id}`, league);
  }

  public populate(league: League) {
    return this.http.post<League>(`${this.endpoint}/leagues/${league._id}/populate`, null);
  }

  public setParameters(leagueId: string, parameters: Array<{ parameter: string; value: string }>) {
    return this.http.post<League>(`${this.endpoint}/leagues/${leagueId}/parameters`, parameters);
  }

  public setRoles(leagueId: string, roles: Array<{ role: string; spots: number[] }>) {
    return this.http.post<League>(`${this.endpoint}/leagues/${leagueId}/roles`, roles);
  }

  public completePreseason(leagueId: string) {
    return this.http.post<League>(`${this.endpoint}/leagues/${leagueId}/complete-preseason`, null);
  }

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
          nextFixtureName += ` - [${fixture.round.competition.name} - ${fixture.round.name} - ${fixture.name}]`;
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

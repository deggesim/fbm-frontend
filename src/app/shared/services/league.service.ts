import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fixture } from '@app/shared/models/fixture';
import { League } from '@app/shared/models/league';
import { RealFixture } from '@app/shared/models/real-fixture';
import { environment } from '@env/environment';
import { EMPTY, forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LeagueService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public getSelectedLeague(): League {
    return JSON.parse(localStorage.getItem('league'));
  }

  public setSelectedLeague(league: League) {
    localStorage.setItem('league', JSON.stringify(league));
  }

  public get refresh() {
    return forkJoin([this.isPreseason(), this.isOffseason(), this.isPostSeason(), this.nextRealFixture()]);
  }

  public nextFixture(): Observable<Fixture> {
    const selectedLeague = this.getSelectedLeague();
    return selectedLeague != null ? this.http.get<Fixture>(`${this.endpoint}/leagues/${selectedLeague._id}/next-fixture`) : EMPTY;
  }

  public nextRealFixture(): Observable<RealFixture> {
    const selectedLeague = this.getSelectedLeague();
    return selectedLeague != null ? this.http.get<RealFixture>(`${this.endpoint}/leagues/${selectedLeague._id}/next-realfixture`) : EMPTY;
  }

  public isPreseason(): Observable<boolean> {
    const selectedLeague = this.getSelectedLeague();
    return selectedLeague != null ? this.http.get<boolean>(`${this.endpoint}/leagues/${selectedLeague._id}/is-preseason`) : EMPTY;
  }

  public isOffseason(): Observable<boolean> {
    const selectedLeague = this.getSelectedLeague();
    return selectedLeague != null ? this.http.get<boolean>(`${this.endpoint}/leagues/${selectedLeague._id}/is-offseason`) : EMPTY;
  }

  public isPostSeason(): Observable<boolean> {
    const selectedLeague = this.getSelectedLeague();
    return selectedLeague != null ? this.http.get<boolean>(`${this.endpoint}/leagues/${selectedLeague._id}/is-postseason`) : EMPTY;
  }
}

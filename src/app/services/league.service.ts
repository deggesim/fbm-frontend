import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fixture } from '@app/models/fixture';
import { League, Status } from '@app/models/league';
import { RealFixture } from '@app/models/real-fixture';
import { environment } from '@env/environment';
import { BehaviorSubject, EMPTY, forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {

  private endpoint = environment.endpoint;

  private $leagueInfo = new BehaviorSubject<string>(null);
  private $leagueInfoObservable = this.$leagueInfo.asObservable();

  private $leagueStatus = new BehaviorSubject<Status>(null);
  private $leagueStatusObservable = this.$leagueStatus.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  public getSelectedLeague(): League {
    return JSON.parse(localStorage.getItem('league'));
  }

  public setSelectedLeague(league: League) {
    localStorage.setItem('league', JSON.stringify(league));
  }

  public get leagueStatusObservable(): Observable<Status> {
    return this.$leagueStatusObservable;
  }

  public set leagueStatus(leagueStatus: Status) {
    this.$leagueStatus.next(leagueStatus);
  }

  public get leagueInfoObservable(): Observable<string> {
    return this.$leagueInfoObservable;
  }

  public set leagueInfo(leagueInfo: string) {
    this.$leagueInfo.next(leagueInfo);
  }

  public get refresh() {
    return forkJoin([this.isPreseason(), this.isOffseason(), this.isPostSeason(), this.nextRealFixture()]).pipe(
      tap((values: any[]) => {
        let nextFixture = '';
        for (const fixture of values[3].fixtures) {
          nextFixture += ` - ${fixture.round.name} ${fixture.name}`;
        }
        const league = this.getSelectedLeague();
        const leagueName = league != null ? league.name : '';
        if (values[0]) {
          this.leagueInfo = `${leagueName} - ${Status.Preseason}`;
          this.leagueStatus = Status.Preseason;
        } else if (values[1]) {
          this.leagueInfo = `${leagueName} - ${Status.Offseason}`;
          this.leagueStatus = Status.Offseason;
        } else if (values[2]) {
          this.leagueInfo = `${leagueName} ${nextFixture}`;
          this.leagueStatus = Status.Postseason;
        } else {
          this.leagueInfo = `${leagueName} ${nextFixture}`;
          this.leagueStatus = Status.RegularSeason;
        }
      })
    );
  }

  public nextFixture(): Observable<Fixture> {
    const selectedLeague = this.getSelectedLeague();
    return selectedLeague != null ? this.http.get<Fixture>(`${this.endpoint}/leagues/${selectedLeague._id}/next-fixture`) : EMPTY;
  }

  public nextRealFixture(): Observable<RealFixture> {
    const selectedLeague = this.getSelectedLeague();
    return selectedLeague != null ? this.http.get<RealFixture>(`${this.endpoint}/leagues/${selectedLeague._id}/next-realfixture`) : EMPTY;
  }

  private isPreseason(): Observable<boolean> {
    const selectedLeague = this.getSelectedLeague();
    return selectedLeague != null ? this.http.get<boolean>(`${this.endpoint}/leagues/${selectedLeague._id}/is-preseason`) : EMPTY;
  }

  private isOffseason(): Observable<boolean> {
    const selectedLeague = this.getSelectedLeague();
    return selectedLeague != null ? this.http.get<boolean>(`${this.endpoint}/leagues/${selectedLeague._id}/is-offseason`) : EMPTY;
  }

  private isPostSeason(): Observable<boolean> {
    const selectedLeague = this.getSelectedLeague();
    return selectedLeague != null ? this.http.get<boolean>(`${this.endpoint}/leagues/${selectedLeague._id}/is-postseason`) : EMPTY;
  }

}

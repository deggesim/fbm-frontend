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

  private $leagueStatus = new BehaviorSubject<string>(null);
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

  public set leagueStatus(leagueStatus: string) {
    this.$leagueStatus.next(leagueStatus);
  }

  public get leagueStatusObservable(): Observable<string> {
    return this.$leagueStatusObservable;
  }

  public get leagueStatusObservableChain() {
    return forkJoin([this.isPreseason(), this.isOffseason(), this.isPostSeason(), this.nextRealFixture()]).pipe(
      tap((values: any[]) => {
        let nextFixture = '';
        for (const fixture of values[3].fixtures) {
          nextFixture += ` - ${fixture.round.name} ${fixture.name}`;
        }
        if (values[0]) {
          this.leagueStatus = ` - ${Status.Preseason}`;
        } else if (values[1]) {
          this.leagueStatus = ` - ${Status.Offseason}`;
        } else if (values[2]) {
          this.leagueStatus = nextFixture;
        } else {
          this.leagueStatus = nextFixture;
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

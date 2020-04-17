import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fixture } from '@app/models/fixture';
import { League, Status } from '@app/models/league';
import { Login } from '@app/models/login';
import { RealFixture } from '@app/models/real-fixture';
import { Role, User } from '@app/models/user';
import { environment } from '@env/environment';
import * as jwtDecode from 'jwt-decode';
import * as moment from 'moment';
import { BehaviorSubject, EMPTY, forkJoin, Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  private endpoint = environment.endpoint;

  private $user = new BehaviorSubject<User>(null);
  private $userObservable = this.$user.asObservable();

  private $leagueStatus = new BehaviorSubject<string>(null);
  private $leagueStatusObservable = this.$leagueStatus.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  public get userObservable(): Observable<User> {
    return this.$userObservable;
  }

  public set user(user: User) {
    this.$user.next(user);
  }

  public get leagueStatusObservableChain() {
    return forkJoin([this.isPreseason(), this.isOffseason(), this.isPostSeason()]).pipe(
      tap((values: boolean[]) => {
        if (values[0]) {
          this.leagueStatus = Status.Preseason;
        } else if (values[1]) {
          this.leagueStatus = Status.Offseason;
        } else if (values[2]) {
          this.leagueStatus = Status.Postseason;
        } else {
          this.leagueStatus = Status.RegularSeason;
        }
      })
    );
  }

  public set leagueStatus(leagueStatus: string) {
    this.$leagueStatus.next(leagueStatus);
  }

  public get leagueStatusObservable(): Observable<string> {
    return this.$leagueStatusObservable;
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

  public nextFixture(): Observable<Fixture> {
    const selectedLeague = this.getSelectedLeague();
    return selectedLeague != null ? this.http.get<Fixture>(`${this.endpoint}/leagues/${selectedLeague._id}/next-fixture`) : EMPTY;
  }

  public nextRealFixture(): Observable<RealFixture> {
    const selectedLeague = this.getSelectedLeague();
    return selectedLeague != null ? this.http.get<RealFixture>(`${this.endpoint}/leagues/${selectedLeague._id}/next-realfixture`) : EMPTY;
  }

  public login(user: Login) {
    return this.http.post<{ user: Login, token: string }>(`${this.endpoint}/users/login`, user)
      .pipe(
        tap((res: { user: User, token: string }) => this.setSession(res)),
        shareReplay()
      );
  }

  public logout() {
    return this.http.post<User>(`${this.endpoint}/users/logout`, {})
      .pipe(
        tap(() => {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('expires_at');
          localStorage.removeItem('league');
        }),
        shareReplay()
      );
  }

  public update(user: User) {
    return this.http.patch<User>(`${this.endpoint}/users/me`, user)
      .pipe(
        tap((res: User) => localStorage.setItem('user', JSON.stringify(res))),
        shareReplay()
      );
  }

  public refresh() {
    return this.http.get(`${this.endpoint}/users/me`)
      .pipe(
        tap((res: { user: User, token: string }) => this.setSession(res)),
        shareReplay()
      );
  }

  // metodi d'utilità
  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  public isAdmin() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    return this.isLoggedIn() && (Role.Admin === user.role || Role.SuperAdmin === user.role);
  }

  public isSuperAdmin() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    return this.isLoggedIn() && Role.SuperAdmin === user.role;
  }

  public getLoggedUser(): User {
    if (this.isLoggedIn()) {
      return JSON.parse(localStorage.getItem('user'));
    } else {
      return null;
    }
  }

  public setSelectedLeague(league: League) {
    localStorage.setItem('league', JSON.stringify(league));
  }

  public getSelectedLeague(): League {
    return JSON.parse(localStorage.getItem('league'));
  }

  // metodi privati
  private getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  private setSession(authResult: { user: User, token: string }) {
    const user = authResult.user;
    const token = authResult.token;
    const decoded: any = jwtDecode(token);
    const exp = decoded.exp;
    const expiresAt = moment().add(exp);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    this.user = user;
  }

}


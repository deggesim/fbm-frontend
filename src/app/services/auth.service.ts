import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '@app/models/login';
import { Role, User } from '@app/models/user';
import { environment } from '@env/environment';
import * as jwtDecode from 'jwt-decode';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  private endpoint = environment.endpoint;

  private $user = new BehaviorSubject<User>(null);
  private $userObservable = this.$user.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  public get userObservable(): Observable<User> {
    return this.$userObservable;
  }

  public set user(user: User) {
    this.$user.next(user);
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


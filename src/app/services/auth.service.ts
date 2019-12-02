import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { shareReplay, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from './../../environments/environment';

@Injectable()
export class AuthService {

  private endpoint = environment.endpoint;

  constructor(
    private http: HttpClient
  ) { }

  public login(user: User) {
    return this.http.post<{ user: User, token: string }>(`${this.endpoint}/users/login`, user)
      .pipe(
        tap((res: { user: User, token: string }) => this.setSession(res)), shareReplay());
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    return this.http.post<User>(`${this.endpoint}/user/logout`, {});
  }

  public salva(user: User) {
    return this.http.patch<{ user: User, token: string }>(`${this.endpoint}/users/me`, user)
      .pipe(
        tap((res: { user: User, token: string }) => localStorage.setItem('user', JSON.stringify(user))), shareReplay());
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  private getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    console.log('moment(expiresAt)', moment(expiresAt));
    return moment(expiresAt);
  }

  private setSession(authResult: { user: User, token: string }) {
    const user = authResult.user;
    const token = authResult.token;
    const exp = jwt_decode(token).exp;
    const expiresAt = moment().add(exp);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

}


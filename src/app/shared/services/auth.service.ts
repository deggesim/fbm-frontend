import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '@app/shared/models/login';
import { Role, User } from '@app/shared/models/user';
import { AppState } from '@app/store/app.state';
import { user } from '@app/store/selectors/user.selector';
import { environment } from '@env/environment';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';

@Injectable()
export class AuthService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  public login(user: Login) {
    return this.http.post<{ user: Login; token: string }>(`${this.endpoint}/users/login`, user);
  }

  public logout() {
    return this.http.post<User>(`${this.endpoint}/users/logout`, {});
  }

  public update(user: User) {
    return this.http.patch<User>(`${this.endpoint}/users/me`, user);
  }

  public load() {
    return this.http.get(`${this.endpoint}/users/me`);
  }

  // metodi d'utilità
  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  public isAdmin$ = (): Observable<boolean> => {
    return this.store.pipe(
      select(user),
      map((user: User) => user && this.isLoggedIn() && (Role.Admin === user.role || Role.SuperAdmin === user.role))
    );
  };

  public isSuperAdmin$ = (): Observable<boolean> => {
    return this.store.pipe(
      select(user),
      map((user: User) => user && this.isLoggedIn() && Role.SuperAdmin === user.role)
    );
  };

  public setAuth(authResult: { user: User; token: string }) {
    const user = authResult.user;
    const token = authResult.token;
    const decoded: any = jwtDecode(token);
    const exp = decoded.exp;
    const expiresAt = moment().add(exp);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  public clearStorage() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('league');
  }

  public getUser(): User {
    return JSON.parse(localStorage.getItem('user')) as User;
  }

  public setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // metodi privati
  private getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '@app/shared/models/login';
import { Role, User } from '@app/shared/models/user';
import { getUser } from '@app/store/actions/user.actions';
import { AppState } from '@app/store/app.state';
import { user } from '@app/store/selectors/user.selector';
import { environment } from '@env/environment';
import { select, Store } from '@ngrx/store';
import jwtDecode from 'jwt-decode';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

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

  // metodi privati
  private getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}

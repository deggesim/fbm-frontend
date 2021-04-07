import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { Auth, Login } from '@app/models/user';
import { environment } from '@env/environment';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getExpiresAt } from '../store/auth.selectors';

@Injectable()
export class AuthService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  public login(user: Login) {
    return this.http.post<Auth>(`${this.endpoint}/users/login`, user);
  }

  public logout() {
    return this.http.post<Auth>(`${this.endpoint}/users/logout`, {});
  }

  public isLoggedIn$ = (): Observable<boolean> => {
    return this.store.pipe(
      select(getExpiresAt),
      map((expiresAt: moment.Moment) => moment().isBefore(expiresAt))
    );
  };
}

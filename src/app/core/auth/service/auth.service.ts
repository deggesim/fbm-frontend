import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { getExpiresAt } from '@app/core/auth/store/auth.selectors';
import { Auth, Login } from '@app/models/user';
import { environment } from '@env/environment';
import { select, Store } from '@ngrx/store';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
      map((expiresAt: DateTime) => DateTime.now() < expiresAt)
    );
  };
}

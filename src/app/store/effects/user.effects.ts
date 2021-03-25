import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toastType } from '@app/shared/constants/globals';
import { Login } from '@app/shared/models/login';
import { User } from '@app/shared/models/user';
import { AuthService } from '@app/shared/services/auth.service';
import { SharedService } from '@app/shared/services/shared.service';
import { environment } from '@env/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import jwtDecode from 'jwt-decode';
import * as moment from 'moment';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { initLeague } from '../actions/league.actions';
import {
  getUser,
  getUserFailed,
  getUserSuccess,
  initUser,
  login,
  loginFailed,
  loginSuccess,
  logout,
  logoutSuccess,
  saveUser,
  saveUserFailed,
  saveUserSuccess,
  setUser
} from '../actions/user.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private authService: AuthService,
    private sharedService: SharedService
  ) {}

  private endpoint = environment.endpoint;

  initUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(initUser),
      switchMap(() => {
        if (this.authService.isLoggedIn()) {
          const user = JSON.parse(localStorage.getItem('user'));
          return of(setUser({ user }));
        } else {
          return of(setUser(null));
        }
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap((action) =>
        this.http.post<{ user: Login; token: string }>(`${this.endpoint}/users/login`, action.user).pipe(
          map((authResult: { user: User; token: string }) => {
            const user = authResult.user;
            const token = authResult.token;
            const decoded: any = jwtDecode(token);
            const exp = decoded.exp;
            const expiresAt = moment().add(exp);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
            return loginSuccess({ user: authResult.user });
          }),
          tap(() => initLeague()),
          tap(() => {
            const title = 'Login';
            const message = 'Login effettuato correttamente';
            this.sharedService.notifica(toastType.success, title, message);
          }),
          catchError(() => of(loginFailed()))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      switchMap(() =>
        this.http.post<User>(`${this.endpoint}/users/logout`, {}).pipe(
          map(() => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('expires_at');
            localStorage.removeItem('league');
            return logoutSuccess();
          }),
          tap(() => {
            const title = 'Logout';
            const message = 'Logout effettuato correttamente';
            this.sharedService.notifica(toastType.warning, title, message);
          })
        )
      )
    )
  );

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUser),
      switchMap(() =>
        this.http.get(`${this.endpoint}/users/me`).pipe(
          map((authResult: { user: User; token: string }) => {
            const user = authResult.user;
            const token = authResult.token;
            const decoded: any = jwtDecode(token);
            const exp = decoded.exp;
            const expiresAt = moment().add(exp);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
            return getUserSuccess({ user: authResult.user });
          }),
          tap(() => {
            const title = 'Modifica user';
            const message = 'User modificato correttamente';
            this.sharedService.notifica(toastType.success, title, message);
          }),
          catchError(() => of(getUserFailed()))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveUser),
      switchMap((action) =>
        this.http.patch<User>(`${this.endpoint}/users/me`, action.user).pipe(
          map((user: User) => {
            localStorage.setItem('user', JSON.stringify(user));
            return saveUserSuccess({ user });
          }),
          catchError(() => of(saveUserFailed()))
        )
      )
    )
  );
}

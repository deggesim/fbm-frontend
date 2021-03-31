import { Injectable } from '@angular/core';
import { toastType } from '@app/shared/constants/globals';
import { User } from '@app/shared/models/user';
import { AuthService } from '@app/shared/services/auth.service';
import { SharedService } from '@app/shared/services/shared.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import jwtDecode from 'jwt-decode';
import * as moment from 'moment';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as leagueActions from '../actions/league.actions';
import * as userActions from '../actions/user.actions';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private authService: AuthService, private sharedService: SharedService) {}

  initUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.initUser),
      switchMap(() => {
        if (this.authService.isLoggedIn()) {
          const user = JSON.parse(localStorage.getItem('user'));
          return of(userActions.setUser({ user }));
        } else {
          return of(userActions.setUser(null));
        }
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.login),
      switchMap((action) =>
        this.authService.login(action.user).pipe(
          map((authResult: { user: User; token: string }) => {
            const user = authResult.user;
            const token = authResult.token;
            const decoded: any = jwtDecode(token);
            const exp = decoded.exp;
            const expiresAt = moment().add(exp);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
            const title = 'Login';
            const message = 'Login effettuato correttamente';
            this.sharedService.notifica(toastType.success, title, message);
            return userActions.loginSuccess({ user: authResult.user });
          }),
          catchError(() => of(userActions.loginFailed()))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.logout),
      switchMap(() =>
        this.authService.logout().pipe(
          map(() => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('expires_at');
            localStorage.removeItem('league');
            const title = 'Logout';
            const message = 'Logout effettuato correttamente';
            this.sharedService.notifica(toastType.warning, title, message);
            return userActions.logoutSuccess();
          }),
        )
      )
    )
  );

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.getUser),
      switchMap(() =>
        this.authService.load().pipe(
          map((authResult: { user: User; token: string }) => {
            const user = authResult.user;
            const token = authResult.token;
            const decoded: any = jwtDecode(token);
            const exp = decoded.exp;
            const expiresAt = moment().add(exp);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
            return userActions.getUserSuccess({ user: authResult.user });
          }),
          tap(() => {
            const title = 'Modifica user';
            const message = 'User modificato correttamente';
            this.sharedService.notifica(toastType.success, title, message);
          }),
          catchError(() => of(userActions.getUserFailed()))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.saveUser),
      switchMap((action) =>
        this.authService.update(action.user).pipe(
          map((user: User) => {
            localStorage.setItem('user', JSON.stringify(user));
            return userActions.saveUserSuccess({ user });
          }),
          catchError(() => of(userActions.saveUserFailed()))
        )
      )
    )
  );
}

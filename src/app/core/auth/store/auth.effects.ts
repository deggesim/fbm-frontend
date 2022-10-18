import { Injectable } from '@angular/core';
import { AuthService } from '@app/core/auth/service/auth.service';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { LocalStorageService } from '@app/core/local-storage.service';
import * as RouterActions from '@app/core/router/store/router.actions';
import { UserService } from '@app/core/user/services/user.service';
import * as UserActions from '@app/core/user/store/user.actions';
import { Auth } from '@app/models/user';
import { ToastService } from '@app/shared/services/toast.service';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import jwtDecode from 'jwt-decode';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService
  ) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      // get token
      map(() => ({ token: this.localStorageService.getToken(), expiresAt: this.localStorageService.getExpiresAt() })),
      // we want dispatch an action only when token and expiresAt are in localStorage
      filter((auth: { token: string; expiresAt: DateTime }) => !!auth.token && !!auth.expiresAt),
      switchMap((auth: { token: string; expiresAt: DateTime }) => [
        AuthActions.setAuth({ auth: { token: auth.token, expiresAt: auth.expiresAt } }),
        UserActions.loadUser(),
      ])
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) =>
        this.authService.login(action.login).pipe(
          map((authResult: Auth) => {
            const token = authResult.token;
            const decoded: any = jwtDecode(token);
            const exp = decoded.exp;
            const expiresAt = DateTime.now().plus({ milliseconds: exp });
            this.localStorageService.setToken(token);
            this.localStorageService.setExpiresAt(expiresAt);
            this.toastService.success('Login', 'Login effettuato correttamente');
            return AuthActions.loginSuccess({ auth: { token, expiresAt } });
          }),
          catchError(() => {
            this.toastService.error('Login', 'Username o password errati');
            return of(AuthActions.loginFailed());
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      switchMap(() => this.userService.loadProfile()),
      map((auth: Auth) => UserActions.setUser({ user: auth.user }))
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => this.authService.logout()),
      tap(() => {
        this.localStorageService.clearStorage();
        this.toastService.warning('Logout', 'Logout effettuato correttamente');
      }),
      switchMap(() => [
        AuthActions.logoutSuccess(),
        UserActions.setUser({ user: null }),
        LeagueActions.setSelectedLeague({ league: null }),
        LeagueInfoActions.setLeagueInfo({ leagueInfo: null }),
        RouterActions.go({ path: ['home'] }),
      ])
    )
  );
}

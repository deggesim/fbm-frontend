import { Injectable } from '@angular/core';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { LocalStorageService } from '@app/core/local-storage.service';
import { go } from '@app/core/router/store/router.actions';
import { UserService } from '@app/core/user/services/user.service';
import * as UserActions from '@app/core/user/store/user.actions';
import { Auth, User } from '@app/models/user';
import { ToastService } from '@app/shared/services/toast.service';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import jwtDecode from 'jwt-decode';
import * as moment from 'moment';
import { of } from 'rxjs';
import { catchError, filter, map, mapTo, switchMap, switchMapTo, tap } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
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
      mapTo([this.localStorageService.getToken(), this.localStorageService.getExpiresAt()]),
      // we want dispatch an action only when token and expiresAt are in localStorage
      filter((auth: [string, moment.Moment]) => !!auth[0] && !!auth[1]),
      switchMap((auth: [string, moment.Moment]) => [
        AuthActions.setAuth({ auth: { token: auth[0], expiresAt: auth[1] } }),
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
            const expiresAt = moment().add(exp);
            this.localStorageService.setToken(token);
            this.localStorageService.setExpiresAt(expiresAt);
            const title = 'Login';
            const message = 'Login effettuato correttamente';
            this.toastService.success(title, message);
            return AuthActions.loginSuccess({ auth: { token, expiresAt } });
          }),
          catchError(() => of(AuthActions.loginFailed()))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      switchMapTo(this.userService.loadProfile()),
      map((auth: Auth) => UserActions.saveUser({ user: auth.user }))
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        this.authService.logout().pipe(
          tap(() => {
            this.localStorageService.clearStorage();
            const title = 'Logout';
            const message = 'Logout effettuato correttamente';
            this.toastService.warning(title, message);
          }),
          switchMapTo([
            LeagueActions.setSelectedLeague({ league: null }),
            LeagueInfoActions.setLeagueInfo({ leagueInfo: null }),
            AuthActions.logoutSuccess(),
            go({ path: ['home'] }),
          ])
        )
      )
    )
  );
}

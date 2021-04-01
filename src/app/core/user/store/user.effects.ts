import { Injectable } from '@angular/core';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { AuthService } from '@app/core/user/services/auth.service';
import { User } from '@app/models/user';
import { toastType } from '@app/shared/constants/globals';
import { SharedService } from '@app/shared/services/shared.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private authService: AuthService, private sharedService: SharedService) {}

  initUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.initUser),
      switchMap(() => {
        if (this.authService.isLoggedIn()) {
          const user = this.authService.getUser();
          return of(UserActions.setUser({ user }));
        } else {
          return of(UserActions.setUser(null));
        }
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.login),
      switchMap((action) =>
        this.authService.login(action.user).pipe(
          map((authResult: { user: User; token: string }) => {
            this.authService.setAuth(authResult);
            const title = 'Login';
            const message = 'Login effettuato correttamente';
            this.sharedService.notifica(toastType.success, title, message);
            return UserActions.loginSuccess({ user: authResult.user });
          }),
          catchError(() => of(UserActions.loginFailed()))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.logout),
      switchMap(() =>
        this.authService.logout().pipe(
          tap(() => LeagueActions.setSelectedLeague({ league: null })),
          map(() => {
            this.authService.clearStorage();
            const title = 'Logout';
            const message = 'Logout effettuato correttamente';
            this.sharedService.notifica(toastType.warning, title, message);
            return UserActions.logoutSuccess();
          })
        )
      )
    )
  );

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getUser),
      switchMap(() =>
        this.authService.load().pipe(
          map((authResult: { user: User; token: string }) => {
            this.authService.setAuth(authResult);
            return UserActions.getUserSuccess({ user: authResult.user });
          }),
          tap(() => {
            const title = 'Modifica user';
            const message = 'User modificato correttamente';
            this.sharedService.notifica(toastType.success, title, message);
          }),
          catchError(() => of(UserActions.getUserFailed()))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.saveUser),
      switchMap((action) =>
        this.authService.update(action.user).pipe(
          map((user: User) => {
            this.authService.setUser(user);
            return UserActions.saveUserSuccess({ user });
          }),
          catchError(() => of(UserActions.saveUserFailed()))
        )
      )
    )
  );
}

import { Injectable } from '@angular/core';
import { AuthService } from '@app/core/auth/service/auth.service';
import { Auth, User } from '@app/models/user';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, switchMapTo, tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService, private authService: AuthService) {}

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      switchMapTo(
        this.userService.loadProfile().pipe(
          map((auth: Auth) => UserActions.loadUserSuccess({ user: auth.user })),
          catchError(() => of(UserActions.loadUserFailed()))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.saveUser),
      switchMap(({ user }) =>
        this.userService.update(user).pipe(
          map((user: User) => UserActions.saveUserSuccess({ user })),
          catchError(() => of(UserActions.saveUserFailed()))
        )
      )
    )
  );
}

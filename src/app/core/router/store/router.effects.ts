import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { user } from '@app/core/user/store/user.selector';
import { Status } from '@app/models/league';
import { Role } from '@app/models/user';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';
import * as RouterActions from './router.actions';

@Injectable()
export class RouterEffects {
  constructor(private actions$: Actions, private router: Router, private location: Location, private store: Store) {}

  goEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.go),
        tap((action) => {
          this.router.navigate(action.path, action.extras);
        })
      ),
    { dispatch: false }
  );

  backEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.back),
        tap(() => this.location.back())
      ),
    { dispatch: false }
  );

  forwardEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.forward),
        tap(() => this.location.forward())
      ),
    { dispatch: false }
  );

  redirectAfterSelectLeague$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.redirectAfterSelectLeague),
        withLatestFrom(this.store.pipe(select(user)), this.store.pipe(select(leagueInfo))),
        tap(([action, userSelected, leagueInfoSelected]) => {
          switch (leagueInfoSelected.status) {
            case Status.Preseason:
              if (userSelected.role === Role.Admin || userSelected.role === Role.SuperAdmin) {
                this.router.navigate(['admin', 'preseason', 'edit-league']);
              } else {
                this.router.navigate(['teams', 'transactions']);
              }
              break;
            case Status.RegularSeason:
              this.router.navigate(['competitions', 'standings']);
              break;
            case Status.Postseason:
              this.router.navigate(['competitions', 'results']);
              break;
            case Status.Offseason:
              this.router.navigate(['competitions', 'calendar']);
              break;
            default:
              break;
          }
        })
      ),
    { dispatch: false }
  );
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AppState } from '@app/core/app.state';
import * as AuthActions from '@app/core/auth/store/auth.actions';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { LocalStorageService } from '@app/core/local-storage.service';
import * as RouterActions from '@app/core/router/store/router.actions';
import * as UserActions from '@app/core/user/store/user.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private store: Store<AppState>, private localStorageService: LocalStorageService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isLoggedIn$().pipe(
      tap((loggedIn: boolean) => {
        if (!loggedIn) {
          this.localStorageService.clearStorage();
          this.store.dispatch(AuthActions.setAuth({auth: null}));
          this.store.dispatch(UserActions.setUser({user: null}));
          this.store.dispatch(LeagueActions.setSelectedLeague({league: null}));
          this.store.dispatch(LeagueInfoActions.setLeagueInfo({leagueInfo: null}));
          this.store.dispatch(RouterActions.go({ path: ['home'] }));
        }
      })
    );
    return true;
  }
}

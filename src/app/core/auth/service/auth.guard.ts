import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AppState } from '@app/core/app.state';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { LocalStorageService } from '@app/core/local-storage.service';
import * as RouterActions from '@app/core/router/store/router.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as AuthActions from '../store/auth.actions';
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
          this.store.dispatch(AuthActions.saveAuth(null));
          this.store.dispatch(LeagueInfoActions.setLeagueInfo(null));
          this.store.dispatch(LeagueActions.setSelectedLeague(null));
          this.store.dispatch(RouterActions.go({ path: ['home'] }));
        }
      })
    );
    return true;
  }
}

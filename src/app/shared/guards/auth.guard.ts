import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@app/shared/services/auth.service';
import * as LeagueInfoActions from '@app/store/actions/league-info.actions';
import * as LeagueActions from '@app/store/actions/league.actions';
import { AppState } from '@app/store/app.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private store: Store<AppState>) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      this.authService.clearStorage();
      this.store.dispatch(LeagueInfoActions.setLeagueInfo(null));
      this.store.dispatch(LeagueActions.setSelectedLeague(null));
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}

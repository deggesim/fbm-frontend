import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@app/shared/services/auth.service';
import { setLeagueInfo } from '@app/store/actions/league-info.actions';
import { setSelectedLeague } from '@app/store/actions/league.actions';
import { logout } from '@app/store/actions/user.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private store: Store) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('expires_at');
      localStorage.removeItem('league');
      this.store.dispatch(setLeagueInfo(null));
      this.store.dispatch(setSelectedLeague(null));
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}

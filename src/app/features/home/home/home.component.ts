import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { AuthService } from '@app/core/auth/service/auth.service';
import * as AuthActions from '@app/core/auth/store/auth.actions';
import { LeagueService } from '@app/core/league/services/league.service';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { LocalStorageService } from '@app/core/local-storage.service';
import { redirectAfterSelectLeague } from '@app/core/router/store/router.actions';
import { UserService } from '@app/core/user/services/user.service';
import { user } from '@app/core/user/store/user.selector';
import { League, LeagueInfo, Status } from '@app/models/league';
import { Login, User } from '@app/models/user';
import { select, Store } from '@ngrx/store';
import { iif } from 'rxjs';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { map, mapTo, switchMapTo } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  user$ = this.store.pipe(select(user));
  leagueInfo$ = this.store.pipe(select(leagueInfo));

  isLoggedIn$ = this.authService.isLoggedIn$();
  isAdmin$ = this.userService.isAdmin$();
  isAdmin: boolean;
  leagues: League[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private leagueService: LeagueService,
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isAdmin$.subscribe((isAdmin: boolean) => {
      this.isAdmin = isAdmin;
    });

    const leagues$ = iif(() => this.isAdmin, this.leagueService.all(), this.user$.pipe(map((user: User) => user?.leagues)));
    this.store.pipe(select(user), switchMapTo(leagues$)).subscribe((leagues: League[]) => {
      this.leagues = leagues;
    });
  }

  public login(login: Login) {
    this.store.dispatch(AuthActions.login({ login }));
  }

  public selectLeague(league: League) {
    this.store.dispatch(LeagueActions.selectLeague({ league }));
  }
}

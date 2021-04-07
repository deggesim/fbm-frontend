import { Component, OnInit } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { AuthService } from '@app/core/auth/service/auth.service';
import * as AuthActions from '@app/core/auth/store/auth.actions';
import { LeagueService } from '@app/core/league/services/league.service';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { UserService } from '@app/core/user/services/user.service';
import { user } from '@app/core/user/store/user.selector';
import { League } from '@app/models/league';
import { Login, User } from '@app/models/user';
import { select, Store } from '@ngrx/store';
import { iif } from 'rxjs';
import { map, switchMapTo } from 'rxjs/operators';

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
    private store: Store<AppState>,
    private leagueService: LeagueService,
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

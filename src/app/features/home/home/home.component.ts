import { Component, OnInit } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { AuthService } from '@app/core/auth/service/auth.service';
import * as AuthActions from '@app/core/auth/store/auth.actions';
import { LeagueService } from '@app/core/league/services/league.service';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { user } from '@app/core/user/store/user.selector';
import { League } from '@app/models/league';
import { Login, Role, User } from '@app/models/user';
import { select, Store } from '@ngrx/store';
import { iif, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  isLoggedIn$ = this.authService.isLoggedIn$();
  leagues$: Observable<League[]>;

  constructor(private authService: AuthService, private store: Store<AppState>, private leagueService: LeagueService) {}

  ngOnInit(): void {
    this.leagues$ = this.store.pipe(
      select(user),
      mergeMap((value: User) =>
        iif(() => value && (Role.Admin === value.role || Role.SuperAdmin === value.role), this.leagueService.all(), of(value?.leagues))
      )
    );
  }

  public login(login: Login) {
    this.store.dispatch(AuthActions.login({ login }));
  }

  public selectLeague(league: League) {
    this.store.dispatch(LeagueActions.selectLeague({ league }));
  }
}

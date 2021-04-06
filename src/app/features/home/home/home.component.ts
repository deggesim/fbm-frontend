import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { AuthService } from '@app/core/auth/service/auth.service';
import * as AuthActions from '@app/core/auth/store/auth.actions';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { LocalStorageService } from '@app/core/local-storage.service';
import { UserService } from '@app/core/user/services/user.service';
import { user } from '@app/core/user/store/user.selector';
import { League, LeagueInfo, Status } from '@app/models/league';
import { Login } from '@app/models/login';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  user$ = this.store.pipe(select(user));
  leagueInfo$ = this.store.pipe(select(leagueInfo));

  isLoggedIn$ = this.authService.isLoggedIn$();
  isAdmin: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.isAdmin$().subscribe((isAdmin: boolean) => {
      this.isAdmin = isAdmin;
    });
  }

  public login(login: Login) {
    this.store.dispatch(AuthActions.login({ login }));
  }

  public selectLeague(league: League) {
    this.localStorageService.setSelectedLeague(league);
    this.store.dispatch(LeagueActions.setSelectedLeague({ league }));
    this.store.dispatch(LeagueInfoActions.refresh());
    this.leagueInfo$.subscribe((leagueInfo: LeagueInfo) => {
      switch (leagueInfo?.status) {
        case Status.Preseason:
          if (this.isAdmin) {
            this.router.navigate(['/admin/preseason/edit-league']);
          } else {
            this.router.navigate(['/teams/transactions']);
          }
          break;
        case Status.RegularSeason:
          this.router.navigate(['/competitions/standings']);
          break;
        case Status.RegularSeason:
          this.router.navigate(['/competitions/standings']);
          break;
        case Status.Postseason:
          this.router.navigate(['/competitions/results']);
          break;
        case Status.Offseason:
          this.router.navigate(['/competitions/calendar']);
          break;
        default:
          break;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { LeagueService } from '@app/core/league/services/league.service';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { AuthService } from '@app/core/user/services/auth.service';
import * as UserActions from '@app/core/user/store/user.actions';
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

  isAdmin: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private leagueService: LeagueService
  ) {}

  ngOnInit(): void {
    this.authService.isAdmin$().subscribe((isAdmin: boolean) => {
      this.isAdmin = isAdmin;
    });
  }

  public isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  public login(user: Login) {
    this.store.dispatch(UserActions.login({ user }));
    this.store.dispatch(LeagueActions.initLeague());
  }

  public selectLeague(league: League) {
    this.leagueService.setSelectedLeague(league);
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

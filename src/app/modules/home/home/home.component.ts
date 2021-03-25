import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { League, LeagueInfo, Status } from '@app/shared/models/league';
import { Login } from '@app/shared/models/login';
import { AuthService } from '@app/shared/services/auth.service';
import { refresh } from '@app/store/actions/league-info.actions';
import { setSelectedLeague } from '@app/store/actions/league.actions';
import { login } from '@app/store/actions/user.actions';
import { leagueInfo, leagueList } from '@app/store/selectors/league.selector';
import { user } from '@app/store/selectors/user.selector';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  user$ = this.store.pipe(select(user))
  leagueList$ = this.store.pipe(select(leagueList));
  leagueInfo$ = this.store.pipe(select(leagueInfo));

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {}

  public isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  public login(user: Login) {
    this.store.dispatch(login({ user }));
  }

  public selectLeague(league: League) {
    this.store.dispatch(setSelectedLeague({ league }));
    this.store.dispatch(refresh());
    this.store.pipe(select(leagueInfo)).subscribe((leagueInfo: LeagueInfo) => {
      this.leagueInfo$.subscribe((leagueInfo: LeagueInfo) => {
        switch (leagueInfo.status) {
          case Status.Preseason:
            if (this.authService.isAdmin()) {
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
    });
  }
}

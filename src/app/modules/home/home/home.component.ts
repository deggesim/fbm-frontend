import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { toastType } from '@app/shared/constants/globals';
import { League, Status } from '@app/shared/models/league';
import { Login } from '@app/shared/models/login';
import { User } from '@app/shared/models/user';
import { AuthService } from '@app/shared/services/auth.service';
import { LeagueService } from '@app/shared/services/league.service';
import { SharedService } from '@app/shared/services/shared.service';
import { isEmpty } from '@app/shared/util/is-empty';
import { selectLeagueStatus } from '@app/store/selectors/league.selector';
import { select, Store } from '@ngrx/store';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  listaLeghe: League[] = [];
  leagueStatus: Status;

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private leagueService: LeagueService,
    private router: Router,
    private store: Store
  ) {
    this.store.pipe(select(selectLeagueStatus)).subscribe((leagueStatus: Status) => {
      this.leagueStatus = leagueStatus;
    });
  }

  ngOnInit() {
    console.log('init HomeComponent');
    if (this.isLoggedIn()) {
      const selectedLeague = this.leagueService.getSelectedLeague();
      const userLogged = this.authService.getLoggedUser();
      this.listaLeghe = userLogged.leagues;
      const leagueFound = this.listaLeghe.find((league: League) => league._id === selectedLeague._id);
      if (leagueFound != null) {
        this.leagueService.setSelectedLeague(leagueFound);
      } else if (this.listaLeghe != null && !isEmpty(this.listaLeghe)) {
        this.leagueService.setSelectedLeague(this.listaLeghe[0]);
      }
      this.leagueService.refresh.subscribe();
    }
  }

  public isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  public login(user: Login) {
    this.authService
      .login(user)
      .pipe(
        tap((loginObj: { user: User; token: string }) => {
          this.listaLeghe = loginObj.user.leagues;
          if (this.listaLeghe != null && !isEmpty(this.listaLeghe)) {
            this.leagueService.setSelectedLeague(this.listaLeghe[0]);
          }
          const title = 'Login';
          const message = 'Login effettuato correttamente';
          this.sharedService.notifica(toastType.success, title, message);
        }),
        switchMap(() => this.leagueService.refresh)
      )
      .subscribe();
  }

  public selectLeague(league: League) {
    this.leagueService.setSelectedLeague(league);
    this.leagueService.refresh.subscribe(() => {
      switch (this.leagueStatus) {
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
  }
}

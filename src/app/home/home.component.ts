import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { League, Status } from '@app/models/league';
import { Login } from '@app/models/login';
import { User } from '@app/models/user';
import { AuthService } from '@app/services/auth.service';
import { LeagueService } from '@app/services/league.service';
import { isEmpty, toastType } from '@app/shared/globals';
import { SharedService } from '@app/shared/shared.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  listaLeghe: League[] = [];
  leagueStatus: string;

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private leagueService: LeagueService,
    private router: Router,
  ) {
    this.leagueService.leagueStatusObservable.subscribe(
      (leagueStatus: string) => {
        this.leagueStatus = leagueStatus;
      }
    );
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
      this.leagueService.leagueStatusObservableChain.subscribe();
    }
  }

  public isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  public isPreseason() {
    return (this.leagueStatus != null) && this.leagueStatus === Status.Preseason;
  }

  public isRegularSeason() {
    return (this.leagueStatus != null) && this.leagueStatus === Status.RegularSeason;
  }

  public isOffSeason() {
    return (this.leagueStatus != null) && this.leagueStatus === Status.Offseason;
  }

  public isPostSeason() {
    return (this.leagueStatus != null) && this.leagueStatus === Status.Postseason;
  }

  public login(user: Login) {
    this.authService.login(user).pipe(
      tap((loginObj: { user: User, token: string }) => {
        this.listaLeghe = loginObj.user.leagues;
        if (this.listaLeghe != null && !isEmpty(this.listaLeghe)) {
          this.leagueService.setSelectedLeague(this.listaLeghe[0]);
        }
        const title = 'Login';
        const message = 'Login effettuato correttamente';
        this.sharedService.notifica(toastType.success, title, message);
      }),
      switchMap(() => this.leagueService.leagueStatusObservableChain)
    ).subscribe();
  }

  public selectLeague(league: League) {
    this.leagueService.setSelectedLeague(league);
    this.leagueService.leagueStatusObservableChain.subscribe(() => {
      if (this.isPreseason()) {
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/preseason/edit-league']);
        } else {
          this.router.navigate(['/teams/transactions']);
        }
      } else if (this.isRegularSeason()) {
        this.router.navigate(['/competitions/standings']);
      } else if (this.isOffSeason()) {
        this.router.navigate(['/competitions/calendar']);
      } else {
        this.router.navigate(['/competitions/results']);
      }
    });
  }

}

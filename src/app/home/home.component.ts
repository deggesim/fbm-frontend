import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { League, Status } from '../models/league';
import { Login } from '../models/login';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import * as globals from '../shared/globals';
import { SharedService } from '../shared/shared.service';

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
    private router: Router,
  ) {
    this.authService.leagueStatusObservable.subscribe(
      (leagueStatus: string) => {
        this.leagueStatus = leagueStatus;
      }
    );
  }

  ngOnInit() {
    console.log('init HomeComponent');
    if (this.isLoggedIn()) {
      const userLogged = this.authService.getLoggedUser();
      this.listaLeghe = userLogged.leagues;
      if (this.listaLeghe != null && this.listaLeghe.length > 0) {
        this.authService.setSelectedLeague(this.listaLeghe[0]);
      }
    }
  }

  public isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  public isPreseason() {
    return (this.leagueStatus != null) && this.leagueStatus === Status.Preseason;
  }

  public login(user: Login) {
    this.authService.login(user).subscribe((loginObj: { user: User, token: string }) => {
      this.listaLeghe = loginObj.user.leagues;
      if (this.listaLeghe != null && this.listaLeghe.length > 0) {
        this.authService.setSelectedLeague(this.listaLeghe[0]);
      }
      const title = 'Login';
      const message = 'Login effettuato correttamente';
      this.sharedService.notifica(globals.toastType.success, title, message);
    });
  }

  public selectLeague(league: League) {
    this.authService.setSelectedLeague(league);
    if (this.authService.isAdmin() && this.isPreseason()) {
      this.router.navigate(['/admin/preseason/edit-league']);
    }
  }

}

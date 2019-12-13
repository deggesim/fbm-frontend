import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { League } from '../models/league';
import { Login } from '../models/login';
import { AuthService } from '../services/auth.service';
import * as globals from '../shared/globals';
import { SharedService } from '../shared/shared.service';
import { User } from '../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  listaLeghe: League[] = [];

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    console.log('init HomeComponent');
    if (this.isLoggedIn()) {
      const userLogged = this.authService.getLoggedUser();
      this.listaLeghe = userLogged.leagues;
    }
  }

  public isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  public async login(user: Login) {
    this.authService.login(user).subscribe((loginObj: { user: User, token: string }) => {
      this.listaLeghe = loginObj.user.leagues;
      const title = 'Login';
      const message = 'Login effettuato correttamente';
      this.sharedService.notifica(globals.toastType.success, title, message);
    });
  }

  public selectLeague(league: League) {
    this.authService.setSelectedLeague(league);
    this.router.navigate(['/admin/edit-league']);
  }

}

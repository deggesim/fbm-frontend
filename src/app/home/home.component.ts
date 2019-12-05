import { Component, OnInit } from '@angular/core';
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

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    console.log('init HomeComponent');
  }

  public isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  public async login(user: User) {
    try {
      await this.authService.login(user).toPromise();
      const title = 'Login';
      const message = 'Login effettuato correttamente';
      this.sharedService.notifica(globals.toastType.success, title, message);
    } catch (error) {
      console.error(error);
    }
  }

}

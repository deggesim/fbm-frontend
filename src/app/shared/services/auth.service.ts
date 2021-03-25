import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '@app/shared/models/login';
import { Role, User } from '@app/shared/models/user';
import { environment } from '@env/environment';
import jwtDecode from 'jwt-decode';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  // metodi d'utilità
  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  public isAdmin() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    return this.isLoggedIn() && (Role.Admin === user.role || Role.SuperAdmin === user.role);
  }

  public isSuperAdmin() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    return this.isLoggedIn() && Role.SuperAdmin === user.role;
  }

  public getLoggedUser(): User {
    if (this.isLoggedIn()) {
      return JSON.parse(localStorage.getItem('user'));
    } else {
      return null;
    }
  }

  // metodi privati
  private getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}

import { Injectable } from '@angular/core';
import { League } from '@app/models/league';
import * as moment from 'moment';

@Injectable()
export class LocalStorageService {
  public clearStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('selectedLeague');
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public setToken(token: string) {
    localStorage.setItem('token', token);
  }

  public getExpiresAt(): moment.Moment {
    const expiration = localStorage.getItem('expires_at');
    return expiration ? moment(JSON.parse(expiration)) : null;
  }

  public setExpiresAt(expiresAt: moment.Moment) {
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  public getSelectedLeague(): League {
    return JSON.parse(localStorage.getItem('selectedLeague')) as League;
  }

  public setSelectedLeague(league: League) {
    console.log('setSelectedLeague');
    localStorage.setItem('selectedLeague', JSON.stringify(league));
  }
}

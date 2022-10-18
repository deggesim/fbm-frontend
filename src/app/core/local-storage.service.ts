import { Injectable } from '@angular/core';
import { League } from '@app/models/league';
import { DateTime } from 'luxon';
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

  public getExpiresAt(): DateTime {
    const expiration = localStorage.getItem('expires_at');
    return expiration ? DateTime.fromMillis(+expiration) : null;
  }

  public setExpiresAt(expiresAt: DateTime) {
    localStorage.setItem('expires_at', String(expiresAt.toMillis()));
  }

  public getSelectedLeague(): League {
    return JSON.parse(localStorage.getItem('selectedLeague')) as League;
  }

  public setSelectedLeague(league: League) {
    localStorage.setItem('selectedLeague', JSON.stringify(league));
  }
}

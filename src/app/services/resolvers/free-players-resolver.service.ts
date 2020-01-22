import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Roster } from 'src/app/models/roster';
import { RosterService } from '../roster.service';

@Injectable({
  providedIn: 'root'
})
export class FreePlayersResolverService implements Resolve<Roster[]> {

  constructor(
    private rosterService: RosterService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Roster[] | Observable<Roster[]> | Promise<Roster[]> {
    return this.rosterService.freePlayers();
  }
}

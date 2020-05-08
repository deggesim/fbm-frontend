import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Roster } from '@app/models/roster';
import { RosterService } from '@app/services/roster.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FreePlayersResolverService implements Resolve<Roster[]> {

  constructor(
    private rosterService: RosterService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Roster[] | Observable<Roster[]> | Promise<Roster[]> {
    return this.rosterService.freePlayers().pipe(
      tap((roster: Roster[]) => roster.sort((a, b) => a.player.name.localeCompare(b.player.name)))
    );
  }
}

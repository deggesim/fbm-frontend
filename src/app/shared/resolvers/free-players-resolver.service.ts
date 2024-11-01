import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RosterList } from '@app/models/roster';
import { RosterService } from '@app/shared/services/roster.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FreePlayersResolverService implements Resolve<RosterList> {
  constructor(private rosterService: RosterService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): RosterList | Observable<RosterList> | Promise<RosterList> {
    return this.rosterService.freePlayers(1, 10);
  }
}

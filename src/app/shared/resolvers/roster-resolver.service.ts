import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RosterList } from '@app/shared/models/roster';
import { RosterService } from '@app/shared/services/roster.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RosterResolverService implements Resolve<RosterList> {

  constructor(
    private rosterService: RosterService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): RosterList | Observable<RosterList> | Promise<RosterList> {
    return this.rosterService.read(1, 10);
  }
}

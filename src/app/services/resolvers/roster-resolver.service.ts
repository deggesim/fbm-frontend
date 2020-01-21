import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Roster } from 'src/app/models/roster';
import { RosterService } from '../roster.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RosterResolverService implements Resolve<Roster[]> {

  constructor(
    private rosterService: RosterService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Roster[] | Observable<Roster[]> | Promise<Roster[]> {
    return this.rosterService.read();
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { League } from '@app/models/league';
import { NewSeasonService } from '@app/services/new-season.service';
import { Observable } from 'rxjs';
import { LeagueService } from '../league.service';

@Injectable({
  providedIn: 'root'
})
export class LeagueResolverService implements Resolve<League> {

  constructor(
    private newSeasonService: NewSeasonService,
    private leagueService: LeagueService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): League | Observable<League> | Promise<League> {
    const selectedLeague = this.leagueService.getSelectedLeague();
    return this.newSeasonService.read(selectedLeague._id);
  }

}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { League } from '@app/models/league';
import { AuthService } from '@app/services/auth.service';
import { NewSeasonService } from '@app/services/new-season.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeagueResolverService implements Resolve<League> {

  constructor(
    private newSeasonService: NewSeasonService,
    private authService: AuthService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): League | Observable<League> | Promise<League> {
    const selectedLeague = this.authService.getSelectedLeague();
    return this.newSeasonService.read(selectedLeague._id);
  }

}

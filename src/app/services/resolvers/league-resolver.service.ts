import { Injectable } from '@angular/core';
import { League } from 'src/app/models/league';
import { NewSeasonService } from '../new-season.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

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

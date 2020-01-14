import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FantasyTeam } from 'src/app/models/fantasy-team';
import { FantasyTeamService } from '../fantasy-team.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FantasyTeamResolverService implements Resolve<FantasyTeam[]> {

  constructor(
    private fantasyTeamService: FantasyTeamService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): FantasyTeam[] | Observable<FantasyTeam[]> | Promise<FantasyTeam[]> {
    return this.fantasyTeamService.read();
  }
}

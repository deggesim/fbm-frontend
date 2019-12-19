import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Team } from 'src/app/models/team';
import { TeamService } from '../team.service';

@Injectable({
  providedIn: 'root'
})
export class TeamResolverService implements Resolve<Team[]> {

  constructor(
    private teamService: TeamService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Team[] | Observable<Team[]> | Promise<Team[]> {
    return this.teamService.read();
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Team } from '@app/models/team';
import { TeamService } from '@app/shared/services/team.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TeamResolverService implements Resolve<Team[]> {
  constructor(private teamService: TeamService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Team[] | Observable<Team[]> | Promise<Team[]> {
    return this.teamService.read().pipe(tap((teams: Team[]) => [...teams].sort((a, b) => a.fullName.localeCompare(b.fullName))));
  }
}

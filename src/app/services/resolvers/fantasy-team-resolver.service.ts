import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { FantasyTeam } from '@app/models/fantasy-team';
import { FantasyTeamService } from '@app/services/fantasy-team.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FantasyTeamResolverService implements Resolve<FantasyTeam[]> {

  constructor(
    private fantasyTeamService: FantasyTeamService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): FantasyTeam[] | Observable<FantasyTeam[]> | Promise<FantasyTeam[]> {
    return this.fantasyTeamService.read().pipe(
      tap((fantasyTeams: FantasyTeam[]) => fantasyTeams.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }
}

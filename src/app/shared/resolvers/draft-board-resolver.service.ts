import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { FantasyTeam } from '@app/models/fantasy-team';
import { FantasyTeamService } from '@app/shared/services/fantasy-team.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DraftBoardResolverService implements Resolve<FantasyTeam[]> {
  constructor(private fantasyTeamService: FantasyTeamService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): FantasyTeam[] | Observable<FantasyTeam[]> | Promise<FantasyTeam[]> {
    return this.fantasyTeamService
      .draftBoard()
      .pipe(map((fantasyTeams: FantasyTeam[]) => [...fantasyTeams].sort((a, b) => a.name.localeCompare(b.name))));
  }
}

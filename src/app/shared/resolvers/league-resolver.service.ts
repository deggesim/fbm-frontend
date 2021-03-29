import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { League } from '@app/shared/models/league';
import { LeagueService } from '@app/shared/services/league.service';
import { NewSeasonService } from '@app/shared/services/new-season.service';
import { selectedLeague } from '@app/store/selectors/league.selector';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LeagueResolverService implements Resolve<League> {
  constructor(private newSeasonService: NewSeasonService, private leagueService: LeagueService, private store: Store) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): League | Observable<League> | Promise<League> {
    return this.store.pipe(
      select(selectedLeague),
      take(1),
      switchMap((league: League) => this.newSeasonService.read(league._id))
    );
  }
}

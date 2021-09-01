import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { LeagueService } from '@app/core/league/services/league.service';
import { selectedLeague } from '@app/core/league/store/league.selector';
import { League } from '@app/models/league';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LeagueResolverService implements Resolve<League> {
  constructor(private leagueService: LeagueService, private store: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): League | Observable<League> | Promise<League> {
    return this.store.pipe(
      select(selectedLeague),
      take(1),
      switchMap((league: League) => this.leagueService.read(league._id))
    );
  }
}

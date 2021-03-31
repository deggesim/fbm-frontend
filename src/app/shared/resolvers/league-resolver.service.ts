import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { League } from '@app/shared/models/league';
import { NewSeasonService } from '@app/shared/services/new-season.service';
import { AppState } from '@app/store/app.state';
import { selectedLeague } from '@app/store/selectors/league.selector';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LeagueResolverService implements Resolve<League> {
  constructor(private newSeasonService: NewSeasonService, private store: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): League | Observable<League> | Promise<League> {
    return this.store.pipe(
      select(selectedLeague),
      take(1),
      switchMap((league: League) => this.newSeasonService.read(league._id))
    );
  }
}

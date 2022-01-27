import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RealFixture } from '@app/models/real-fixture';
import { RealFixtureService } from '@app/shared/services/real-fixture.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealFixtureResolverService implements Resolve<RealFixture[]> {
  constructor(private realFixtureService: RealFixtureService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): RealFixture[] | Observable<RealFixture[]> | Promise<RealFixture[]> {
    return this.realFixtureService
      .read()
      .pipe(map((realFixtures: RealFixture[]) => [...realFixtures].sort((a: RealFixture, b: RealFixture) => a.order - b.order)));
  }
}

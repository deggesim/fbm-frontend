import { Injectable } from '@angular/core';
import { RealFixture } from 'src/app/models/real-fixture';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RealFixtureService } from '../real-fixture.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealFixtureResolverService implements Resolve<RealFixture[]> {

  constructor(
    private realFixtureService: RealFixtureService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): RealFixture[] | Observable<RealFixture[]> | Promise<RealFixture[]> {
    return this.realFixtureService.read();
  }
}

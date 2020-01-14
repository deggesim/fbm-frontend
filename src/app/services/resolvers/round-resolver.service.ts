import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Round } from 'src/app/models/round';
import { RoundService } from '../round.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoundResolverService implements Resolve<Round[]> {

  constructor(
    private roundService: RoundService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Round[] | Observable<Round[]> | Promise<Round[]> {
    return this.roundService.read();
  }
}

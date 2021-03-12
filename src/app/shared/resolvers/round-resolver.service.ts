import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Round } from '@app/shared/models/round';
import { RoundService } from '@app/shared/services/round.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoundResolverService implements Resolve<Round[]> {
  constructor(private roundService: RoundService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Round[] | Observable<Round[]> | Promise<Round[]> {
    return this.roundService.read();
  }
}

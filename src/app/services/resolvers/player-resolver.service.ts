import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Player } from '@app/models/player';
import { PlayerService } from '@app/services/player.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerResolverService implements Resolve<Player[]> {

  constructor(
    private playerService: PlayerService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Player[] | Observable<Player[]> | Promise<Player[]> {
    return this.playerService.read();
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Player } from 'src/app/models/player';
import { PlayerService } from '../player.service';

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

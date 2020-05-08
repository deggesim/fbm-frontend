import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { User } from '@app/models/user';
import { UserService } from '@app/services/user.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersResolverService implements Resolve<User[]> {

  constructor(
    private userService: UserService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): User[] | Observable<User[]> | Promise<User[]> {
    return this.userService.read().pipe(
      tap((users: User[]) => users.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

}

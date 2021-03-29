import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { League } from '@app/shared/models/league';
import { selectedLeague } from '@app/store/selectors/league.selector';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TenantInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.pipe(
      select(selectedLeague),
      take(1),
      switchMap((league: League) => {
        if (league && league._id) {
          const cloned = req.clone({
            headers: req.headers.set('league', league._id),
          });
          return next.handle(cloned);
        } else {
          return next.handle(req);
        }
      })
    );
  }
}

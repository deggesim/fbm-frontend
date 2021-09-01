import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { selectedLeague } from '@app/core/league/store/league.selector';
import { League } from '@app/models/league';
import { select, Store } from '@ngrx/store';
import { isEmpty } from 'lodash-es';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TenantInterceptor implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.pipe(
      select(selectedLeague),
      take(1),
      switchMap((league: League) => {
        if (!isEmpty(league)) {
          return next.handle(
            req.clone({
              headers: req.headers.set('league', league._id),
            })
          );
        } else {
          return next.handle(req);
        }
      })
    );
  }
}
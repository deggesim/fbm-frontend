import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { League } from '@app/shared/models/league';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TenantInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const leagueString = localStorage.getItem('league');
    if (leagueString != null) {
      const league: League = JSON.parse(localStorage.getItem('league'));
      const cloned = req.clone({
        headers: req.headers.set('league', league._id),
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}

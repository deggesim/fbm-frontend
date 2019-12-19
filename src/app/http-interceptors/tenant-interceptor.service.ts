import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { League } from '../models/league';

@Injectable({
  providedIn: 'root'
})
export class TenantInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const league: League = JSON.parse(localStorage.getItem('league'));
    if (league) {
      const cloned = req.clone({
        headers: req.headers.set('league', league._id)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }

}

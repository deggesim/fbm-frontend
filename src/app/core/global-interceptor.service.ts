import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@app/core/app.state';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { SharedService } from '@app/shared/services/shared.service';
import { SpinnerService } from './spinner.service';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from './user/services/auth.service';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {
  constructor(
    private sharedService: SharedService,
    private spinnerService: SpinnerService,
    private store: Store<AppState>,
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get('hideSpinner') !== 'true') {
      this.spinnerService.start();
    }
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        this.sharedService.notifyError(err);
        if (401 === err.status) {
          this.authService.clearStorage();
          this.store.dispatch(LeagueInfoActions.setLeagueInfo(null));
          this.store.dispatch(LeagueActions.setSelectedLeague(null));
          this.router.navigate(['/home']);
        }
        return throwError(err);
      }),
      finalize(() => {
        if (req.headers.get('hideSpinner') !== 'true') {
          this.spinnerService.end();
        }
      })
    );
  }
}

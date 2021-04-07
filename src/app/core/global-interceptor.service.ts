import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppState } from '@app/core/app.state';
import * as AuthActions from '@app/core/auth/store/auth.actions';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import * as LeagueActions from '@app/core/league/store/league.actions';
import * as RouterActions from '@app/core/router/store/router.actions';
import * as UserActions from '@app/core/user/store/user.actions';
import { SharedService } from '@app/shared/services/shared.service';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { SpinnerService } from './spinner.service';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {
  constructor(
    private sharedService: SharedService,
    private spinnerService: SpinnerService,
    private store: Store<AppState>,
    private localStorageService: LocalStorageService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get('hideSpinner') !== 'true') {
      this.spinnerService.start();
    }
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        this.sharedService.notifyError(err);
        if (401 === err.status) {
          this.localStorageService.clearStorage();
          this.store.dispatch(AuthActions.setAuth({ auth: null }));
          this.store.dispatch(UserActions.setUser({ user: null }));
          this.store.dispatch(LeagueActions.setSelectedLeague({ league: null }));
          this.store.dispatch(LeagueInfoActions.setLeagueInfo({ leagueInfo: null }));
          this.store.dispatch(RouterActions.go({ path: ['home'] }));
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

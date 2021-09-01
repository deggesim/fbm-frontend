import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppState } from '@app/core/app.state';
import * as AuthActions from '@app/core/auth/store/auth.actions';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import * as LeagueActions from '@app/core/league/store/league.actions';
import * as RouterActions from '@app/core/router/store/router.actions';
import * as UserActions from '@app/core/user/store/user.actions';
import { ToastService } from '@app/shared/services/toast.service';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { SpinnerService } from './spinner.service';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {
  constructor(
    private spinnerService: SpinnerService,
    private store: Store<AppState>,
    private localStorageService: LocalStorageService,
    private toastService: ToastService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get('hideSpinner') !== 'true') {
      this.spinnerService.start();
    }
    return next.handle(req).pipe(
      catchError((response: HttpErrorResponse) => {
        if (response != null && !response.url.includes('login')) {
          let titolo = '';
          let descrizione = '';
          console.error(response);
          switch (response.status) {
            case 400:
              titolo = 'Errore nella richiesta';
              descrizione = response.error || response.message || 'I dati inseriti sono errati';
              break;
            case 401:
              this.localStorageService.clearStorage();
              this.store.dispatch(AuthActions.setAuth({ auth: null }));
              this.store.dispatch(UserActions.setUser({ user: null }));
              this.store.dispatch(LeagueActions.setSelectedLeague({ league: null }));
              this.store.dispatch(LeagueInfoActions.setLeagueInfo({ leagueInfo: null }));
              this.store.dispatch(RouterActions.go({ path: ['home'] }));
              titolo = 'Utente non loggato';
              descrizione = "L'utente non è loggato o la sessione è scaduta";
              break;
            case 403:
              titolo = 'Utente non autorizzato';
              descrizione = "L'utente non è autorizzato ad eseguire l'operazione richiesta";
              break;
            case 422:
              titolo = 'Errore nella richiesta';
              descrizione = response.error || response.message;
              break;
            case 500:
              titolo = 'Errore server';
              descrizione = 'Si è verificato un errore imprevisto';
              break;
            default:
              titolo = 'Problema generico';
              descrizione = 'Si è verificato un errore imprevisto';
              break;
          }
          this.toastService.error(titolo, descrizione);
        }
        return throwError(response);
      }),
      finalize(() => {
        if (req.headers.get('hideSpinner') !== 'true') {
          this.spinnerService.end();
        }
      })
    );
  }
}

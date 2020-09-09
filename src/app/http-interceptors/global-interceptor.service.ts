
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@app/shared/shared.service';
import { SpinnerService } from '@app/shared/spinner.service';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {

  constructor(
    private sharedService: SharedService,
    private spinnerService: SpinnerService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get('hideSpinner') !== 'true') {
      this.spinnerService.start();
    }
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        this.sharedService.notifyError(err);
        if (401 === err.status) {
          this.router.navigate(['home']);
        }
        return throwError(err);
      }),
      finalize(() => {
        if (req.headers.get('hideSpinner') !== 'true') {
          this.spinnerService.end();
        }
      }));
  }

}

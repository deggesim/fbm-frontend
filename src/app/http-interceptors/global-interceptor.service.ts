
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SharedService } from './../shared/shared.service';
import { SpinnerService } from './../shared/spinner.service';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {

  constructor(
    private sharedService: SharedService,
    private spinnerService: SpinnerService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.start();
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        this.spinnerService.end();
        this.sharedService.notifyError(err);
        if (401 === err.status || 403 === err.status) {
          this.router.navigate(['home']);
        }
        return throwError(err);
      }),
      finalize(() => this.spinnerService.end()));
  }

}


import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { empty as observableEmpty, Observable, EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SharedService } from './../shared/shared.service';
import { SpinnerService } from './../shared/spinner.service';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {

  constructor(
    private sharedService: SharedService,
    private spinnerService: SpinnerService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.start();
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        this.spinnerService.end();
        this.sharedService.notifyError(err);
        return EMPTY;
      }),
      finalize(() => this.spinnerService.end()));
  }

}

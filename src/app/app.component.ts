import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { User } from './models/user';
import { AuthService } from './services/auth.service';
import { NewSeasonService } from './services/new-season.service';
import { toastType } from './shared/globals';
import { SharedService } from './shared/shared.service';
import { SpinnerService } from './shared/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {

  // Sets initial value to true to show loading spinner on first load
  loading = true;

  mostraPopupUserProfile: boolean;

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private sharedService: SharedService,
    private authService: AuthService,
    private newSeasonService: NewSeasonService
  ) { }

  ngOnInit() {
    console.log('ngOnInit AppComponent');
    if (this.authService.isLoggedIn()) {
      this.authService.user = JSON.parse(localStorage.getItem('user'));
      this.authService.leagueStatusObservableChain.subscribe();
    }
  }

  ngAfterViewChecked(): void {
    this.loading = this.spinnerService.isLoading();
    this.cdRef.detectChanges();
  }

  public profile() {
    this.mostraPopupUserProfile = true;
  }

  public logout() {
    this.authService.logout().subscribe((user: User) => {
      const title = 'Logout';
      const message = 'Logout effettuato correttamente';
      this.sharedService.notifica(toastType.warning, title, message);
      this.router.navigate(['/home']);
    });
  }

  public annulla() {
    this.mostraPopupUserProfile = false;
  }

  public salva(user: User) {
    this.mostraPopupUserProfile = false;
    this.authService.update(user).subscribe(() => {
      const title = 'Modifica user';
      const message = 'User modificato correttamente';
      this.sharedService.notifica(toastType.success, title, message);
    });
  }

  public completePreseason() {
    this.newSeasonService.completePreseason(this.authService.getSelectedLeague()._id).pipe(
      catchError((err) => {
        this.sharedService.notifyError(err);
        return EMPTY;
      }),
      switchMap(() => this.authService.leagueStatusObservableChain)
    ).subscribe(() => {
      const title = 'Presason completata';
      const message = 'Il torneo ora è nella fase "Stagione regolare"';
      this.sharedService.notifica(toastType.success, title, message);
      this.router.navigate(['/home']);
    });
  }

}

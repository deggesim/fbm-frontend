import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { AuthService } from './services/auth.service';
import * as globals from './shared/globals';
import { SharedService } from './shared/shared.service';
import { SpinnerService } from './shared/spinner.service';
import { Router } from '@angular/router';

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
    public spinnerService: SpinnerService,
    private sharedService: SharedService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log('ngOnInit AppComponent');
  }

  ngAfterViewChecked(): void {
    this.loading = this.spinnerService.isLoading();
    this.cdRef.detectChanges();
  }

  public profile() {
    this.mostraPopupUserProfile = true;
  }

  public async logout() {
    try {
      await this.authService.logout();
      const title = 'Logout';
      const message = 'Logout effettuato correttamente';
      this.sharedService.notifica(globals.toastType.warning, title, message);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error(error);
    }
  }

  public annulla() {
    this.mostraPopupUserProfile = false;
  }

  public async salva(user: User) {
    try {
      this.mostraPopupUserProfile = false;
      await this.authService.salva(user).toPromise();
      const title = 'Modifica user';
      const message = 'User modificato correttamente';
      this.sharedService.notifica(globals.toastType.success, title, message);
    } catch (error) {
      console.error(error);
    }
  }

}

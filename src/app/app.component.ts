import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { SpinnerService } from '@app/core/spinner.service';
import * as UserActions from '@app/core/user/store/user.actions';
import { Store } from '@ngrx/store';
import * as AuthActions from './core/auth/store/auth.actions';
import * as LeagueActions from './core/league/store/league.actions';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewChecked {
  // Sets initial value to true to show loading spinner on first load
  loading = true;

  mostraPopupUserProfile: boolean;

  constructor(private cdRef: ChangeDetectorRef, private spinnerService: SpinnerService, private store: Store<AppState>) {}

  ngAfterViewChecked(): void {
    this.loading = this.spinnerService.isLoading();
    this.cdRef.detectChanges();
  }

  public profile() {
    this.mostraPopupUserProfile = true;
  }

  public logout() {
    this.store.dispatch(AuthActions.logout());
  }

  public annulla() {
    this.mostraPopupUserProfile = false;
  }

  public salva(user: User) {
    this.mostraPopupUserProfile = false;
    this.store.dispatch(UserActions.saveUser({ user }));
  }

  public completePreseason() {
    this.store.dispatch(LeagueActions.completePreseason());
  }
}

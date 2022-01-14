import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { AppState } from '@app/core/app.state';
import { SpinnerService } from '@app/core/spinner.service';
import * as UserActions from '@app/core/user/store/user.actions';
import { Store } from '@ngrx/store';
import { forkJoin, noop, of, switchMap, switchMapTo, take, tap, zip } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './core/auth/service/auth.service';
import * as AuthActions from './core/auth/store/auth.actions';
import * as LeagueActions from './core/league/store/league.actions';
import { User } from './models/user';
import { PushSubscriptionService } from './shared/services/push-subscription.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewChecked {
  // Sets initial value to true to show loading spinner on first load
  loading = true;
  mostraPopupUserProfile: boolean;
  readonly VAPID_PUBLIC_KEY = environment.vapidPublikKey;

  constructor(
    private cdRef: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private store: Store<AppState>,
    private swPush: SwPush,
    private authService: AuthService,
    private pushSubscriptionService: PushSubscriptionService
  ) {}

  ngOnInit(): void {
    this.authService
      .isLoggedIn$()
      .pipe(switchMap((loggedIn: boolean) => zip(of(loggedIn), this.swPush.subscription)))
      .subscribe((values: [boolean, PushSubscription]) => {
        if (values[0] && !values[1]) {
          this.subscribeToNotification();
        }
      });
  }

  private subscribeToNotification() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((sub: PushSubscription) => this.pushSubscriptionService.save(sub).subscribe(noop));
  }

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

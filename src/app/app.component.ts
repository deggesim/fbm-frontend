import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { AppState } from '@app/core/app.state';
import { SpinnerService } from '@app/core/spinner.service';
import * as UserActions from '@app/core/user/store/user.actions';
import { Store } from '@ngrx/store';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { noop, of, switchMap, zip } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './core/auth/service/auth.service';
import * as AuthActions from './core/auth/store/auth.actions';
import * as LeagueActions from './core/league/store/league.actions';
import { User } from './models/user';
import { PopupConfirmComponent } from './shared/components/popup-confirm/popup-confirm.component';
import { AppUpdateService } from './shared/services/app-update.service';
import { PushSubscriptionService } from './shared/services/push-subscription.service';

@Component({
  selector: 'fbm-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewChecked {
  // Sets initial value to true to show loading spinner on first load
  loading = true;
  showModalUserProfile: boolean;
  readonly VAPID_PUBLIC_KEY = environment.vapidPublikKey;

  @ViewChild('popupAggiorna', { static: true }) public popupAggiorna!: PopupConfirmComponent;
  @ViewChild('popupConfirmPreseason', { static: true }) public popupConfirmPreseason!: PopupConfirmComponent;
  @ViewChild('modalUserProfile', { static: false }) modalUserProfile: ModalDirective;

  constructor(
    private cdRef: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private store: Store<AppState>,
    private swPush: SwPush,
    private authService: AuthService,
    private pushSubscriptionService: PushSubscriptionService,
    private appUpdateService: AppUpdateService
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

    this.appUpdateService.updateAvaliable$.subscribe((updateAvailable: boolean) => {
      if (updateAvailable) {
        this.popupAggiorna.openModal();
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

  public openModal() {
    this.showModalUserProfile = true;
  }

  public logout() {
    this.store.dispatch(AuthActions.logout());
  }

  public save(user: User) {
    this.hideModal();
    this.store.dispatch(UserActions.saveUser({ user }));
  }

  hideModal(): void {
    this.modalUserProfile?.hide();
  }

  onHidden(): void {
    this.showModalUserProfile = false;
  }

  openCompletePreseasonPopup() {
    this.popupConfirmPreseason.openModal();
  }

  public completePreseason() {
    this.store.dispatch(LeagueActions.completePreseason());
  }

  public aggiornaApp() {
    this.popupAggiorna.closeModal();
    this.appUpdateService.doAppUpdate();
  }
}

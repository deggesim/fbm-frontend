import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { LeagueService } from '@app/core/league/services/league.service';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import * as LeagueActions from '@app/core/league/store/league.actions';
import { SpinnerService } from '@app/core/spinner.service';
import * as UserActions from '@app/core/user/store/user.actions';
import { toastType } from '@app/shared/constants/globals';
import { SharedService } from '@app/shared/services/shared.service';
import { select, Store } from '@ngrx/store';
import { concatMap, tap } from 'rxjs/operators';
import { selectedLeague } from './core/league/store/league.selector';
import { AuthService } from './core/user/services/auth.service';
import { League } from './models/league';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
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
    private leagueService: LeagueService,
    private authService: AuthService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.store.dispatch(UserActions.initUser());
    this.store.dispatch(LeagueActions.initLeague());
    if (this.authService.isLoggedIn()) {
      this.store.dispatch(LeagueInfoActions.refresh());
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
    this.store.dispatch(UserActions.logout());
    this.store.dispatch(LeagueInfoActions.setLeagueInfo(null));
    this.store.dispatch(LeagueActions.setSelectedLeague(null));
    this.router.navigate(['/home']);
  }

  public annulla() {
    this.mostraPopupUserProfile = false;
  }

  public salva(user: User) {
    this.mostraPopupUserProfile = false;
    this.store.dispatch(UserActions.saveUser({ user }));
  }

  public completePreseason() {
    this.store
      .pipe(
        select(selectedLeague),
        concatMap((league: League) => this.leagueService.completePreseason(league._id)),
        tap((league: League) => this.store.dispatch(LeagueInfoActions.refresh()))
      )
      .subscribe(() => {
        const title = 'Presason completata';
        const message = 'Il torneo ora è nella fase "Stagione regolare"';
        this.sharedService.notifica(toastType.success, title, message);
        this.router.navigate(['/home']);
      });
  }
}

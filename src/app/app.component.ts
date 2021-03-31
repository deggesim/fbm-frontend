import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { toastType } from '@app/shared/constants/globals';
import { User } from '@app/shared/models/user';
import { NewSeasonService } from '@app/shared/services/new-season.service';
import { SharedService } from '@app/shared/services/shared.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { select, Store } from '@ngrx/store';
import { concatMap, tap } from 'rxjs/operators';
import { League } from './shared/models/league';
import * as LeagueInfoActions from './store/actions/league-info.actions';
import * as LeagueActions from './store/actions/league.actions';
import * as UserActions from './store/actions/user.actions';
import { AppState } from './store/app.state';
import { selectedLeague } from './store/selectors/league.selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
    private newSeasonService: NewSeasonService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.store.dispatch(UserActions.initUser());
    this.store.dispatch(LeagueActions.initLeague());
    this.store.dispatch(LeagueInfoActions.refresh());
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
        concatMap((league: League) => this.newSeasonService.completePreseason(league._id)),
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

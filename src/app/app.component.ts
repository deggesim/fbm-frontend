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
import { refresh } from './store/actions/league-info.actions';
import { initLeague, setSelectedLeague } from './store/actions/league.actions';
import { initUser, logout, saveUser } from './store/actions/user.actions';
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
    private store: Store
  ) {}

  ngOnInit() {
    this.store.dispatch(initUser());
    this.store.dispatch(initLeague());
  }

  ngAfterViewChecked(): void {
    this.loading = this.spinnerService.isLoading();
    this.cdRef.detectChanges();
  }

  public profile() {
    this.mostraPopupUserProfile = true;
  }

  public logout() {
    this.store.dispatch(logout());
    this.store.dispatch(setSelectedLeague(null));
    this.router.navigate(['/home']);
  }

  public annulla() {
    this.mostraPopupUserProfile = false;
  }

  public salva(user: User) {
    this.mostraPopupUserProfile = false;
    this.store.dispatch(saveUser({ user }));
  }

  public completePreseason() {
    this.store
      .pipe(
        select(selectedLeague),
        concatMap((league: League) => this.newSeasonService.completePreseason(league._id)),
        tap((league: League) => this.store.dispatch(refresh()))
      )
      .subscribe(() => {
        const title = 'Presason completata';
        const message = 'Il torneo ora è nella fase "Stagione regolare"';
        this.sharedService.notifica(toastType.success, title, message);
        this.router.navigate(['/home']);
      });
  }
}

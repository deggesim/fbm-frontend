import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { LeagueInfo, Status } from '@app/shared/models/league';
import { AuthService } from '@app/shared/services/auth.service';
import { leagueInfo, selectedLeague } from '@app/store/selectors/league.selector';
import { user } from '@app/store/selectors/user.selector';
import { select, Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

interface IBreadcrumb {
  label: string;
  params?: Params;
  url: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() openLogin: EventEmitter<any> = new EventEmitter(true);
  @Output() logout: EventEmitter<any> = new EventEmitter(true);
  @Output() profile: EventEmitter<any> = new EventEmitter(true);
  @Output() completePreseason: EventEmitter<any> = new EventEmitter(true);

  isCollapsed = true;
  admin: boolean;
  user$ = this.store.pipe(select(user));
  selectedLeague$ = this.store.pipe(select(selectedLeague));
  leagueInfo$ =  this.store.pipe(select(leagueInfo));
  leagueStatus: Status;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService, private store: Store) {
    this.store.pipe(select(leagueInfo)).subscribe((leagueInfo: LeagueInfo) => {
      this.leagueStatus = leagueInfo?.status;
    });
  }

  ngOnInit() {
    // subscribe to the NavigationEnd event
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      // set breadcrumbs
      const root: ActivatedRoute = this.activatedRoute.root;
    });
    this.admin = this.authService.isAdmin();
  }

  public isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }

  public isPreseason() {
    return this.leagueStatus != null && this.leagueStatus === Status.Preseason;
  }

  get transactionLabel() {
    return this.isPreseason() ? 'Asta fantamercato' : 'Mercato libero';
  }
}

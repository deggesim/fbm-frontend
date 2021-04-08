import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { AuthService } from '@app/core/auth/service/auth.service';
import { leagueInfo, selectedLeague } from '@app/core/league/store/league.selector';
import { UserService } from '@app/core/user/services/user.service';
import { user } from '@app/core/user/store/user.selector';
import { League, LeagueInfo } from '@app/models/league';
import { User } from '@app/models/user';
import { select, Store } from '@ngrx/store';
import { isEmpty } from 'lodash-es';
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

  isLoggedIn$ = this.authService.isLoggedIn$();
  isCollapsed = true;
  isAdmin: boolean;
  user: User;
  selectedLeague: League;
  leagueInfo: LeagueInfo;
  isEmpty = isEmpty;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    // subscribe to the NavigationEnd event
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      // set breadcrumbs
      const root: ActivatedRoute = this.activatedRoute.root;
    });
    this.store.pipe(select(user)).subscribe((user: User) => {
      this.user = user;
    });
    this.store.pipe(select(selectedLeague)).subscribe((league: League) => {
      this.selectedLeague = league;
    });
    this.store.pipe(select(leagueInfo)).subscribe((leagueInfo: LeagueInfo) => {
      this.leagueInfo = leagueInfo;
    });
    this.userService.isAdmin$().subscribe((isAdmin: boolean) => {
      this.isAdmin = isAdmin;
    });
  }

  get transactionLabel() {
    return this.leagueInfo.preSeason ? 'Asta fantamercato' : 'Mercato libero';
  }
}

import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { selectedLeague, leagueInfo } from '@app/core/league/store/league.selector';
import { AuthService } from '@app/core/user/services/auth.service';
import { user } from '@app/core/user/store/user.selector';
import { League, LeagueInfo } from '@app/models/league';
import { User } from '@app/models/user';
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
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: User;
  selectedLeague: League;
  leagueInfo: LeagueInfo;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private store: Store<AppState>,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // subscribe to the NavigationEnd event
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      // set breadcrumbs
      const root: ActivatedRoute = this.activatedRoute.root;
    });
    this.isLoggedIn = this.authService.isLoggedIn();
    console.log(this.isLoggedIn);
    
    this.store.pipe(select(user)).subscribe((user: User) => {
      this.user = user;
    });
    this.store.pipe(select(selectedLeague)).subscribe((league: League) => {
      this.selectedLeague = league;
    });
    this.store.pipe(select(leagueInfo)).subscribe((leagueInfo: LeagueInfo) => {
      this.leagueInfo = leagueInfo;
    });
    this.authService.isAdmin$().subscribe((isAdmin: boolean) => {
      this.isAdmin = isAdmin;
    });
  }

  get transactionLabel() {
    return this.leagueInfo.preSeason ? 'Asta fantamercato' : 'Mercato libero';
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET, Router } from '@angular/router';
import { Status } from '@app/models/league';
import { User } from '@app/models/user';
import { AuthService } from '@app/services/auth.service';
import { LeagueService } from '@app/services/league.service';
import { filter } from 'rxjs/operators';

interface IBreadcrumb {
  label: string;
  params?: Params;
  url: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() openLogin: EventEmitter<any> = new EventEmitter(true);
  @Output() logout: EventEmitter<any> = new EventEmitter(true);
  @Output() profile: EventEmitter<any> = new EventEmitter(true);
  @Output() completePreseason: EventEmitter<any> = new EventEmitter(true);

  isCollapsed = true;
  breadcrumbs: IBreadcrumb[] = [];
  admin: boolean;
  user: User;
  leagueInfo: string;
  leagueStatus: Status;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private leagueService: LeagueService,
  ) {
    this.authService.userObservable.subscribe(
      (user: User) => {
        this.user = user;
      }
    );

    this.leagueService.leagueInfoObservable.subscribe(
      (leagueInfo: string) => {
        this.leagueInfo = leagueInfo;
      }
    );

    this.leagueService.leagueStatusObservable.subscribe(
      (leagueStatus: Status) => {
        this.leagueStatus = leagueStatus;
      }
    );
  }

  ngOnInit() {
    // subscribe to the NavigationEnd event
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        // set breadcrumbs
        const root: ActivatedRoute = this.activatedRoute.root;
        this.breadcrumbs = this.getBreadcrumbs(root);
      });
    this.admin = this.authService.isAdmin();
  }

  public isLoggedIn() {
    return (this.user != null) && this.authService.isLoggedIn();
  }

  public isAdmin() {
    return (this.user != null) && this.authService.isAdmin();
  }

  public getSelectedLeague() {
    const league = this.leagueService.getSelectedLeague();
    return league != null ? league.name : '';
  }

  public leagueSelected(): boolean {
    const league = this.leagueService.getSelectedLeague();
    return league != null;
  }

  public isPreseason() {
    return (this.leagueStatus != null) && this.leagueStatus === Status.Preseason;
  }

  get transactionLabel() {
    return this.isPreseason() ? 'Asta fantamercato' : 'Mercato libero';
  }

  private getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';

    // get the child routes
    const children: ActivatedRoute[] = route.children;

    // return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }

    // iterate over each children
    for (const child of children) {
      // verify primary route
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      // verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      // get the route's URL segment
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

      // append route URL to URL
      url += `/${routeURL}`;

      // add breadcrumb
      const breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        url
      };
      breadcrumbs.push(breadcrumb);

      // recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }

    // we should never get here, but just in case
    return breadcrumbs;
  }

}

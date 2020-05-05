import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
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

}

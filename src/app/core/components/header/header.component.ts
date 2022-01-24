import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { AuthService } from '@app/core/auth/service/auth.service';
import { leagueInfo, selectedLeague } from '@app/core/league/store/league.selector';
import { UserService } from '@app/core/user/services/user.service';
import { user } from '@app/core/user/store/user.selector';
import { League, LeagueInfo } from '@app/models/league';
import { User } from '@app/models/user';
import { select, Store } from '@ngrx/store';
import { isEmpty } from 'lodash-es';

@Component({
  selector: 'fbm-header',
  templateUrl: './header.component.html',
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

  constructor(private authService: AuthService, private userService: UserService, private store: Store<AppState>) {}

  ngOnInit() {
    this.store.pipe(select(user)).subscribe((value: User) => {
      this.user = value;
    });
    this.store.pipe(select(selectedLeague)).subscribe((value: League) => {
      this.selectedLeague = value;
    });
    this.store.pipe(select(leagueInfo)).subscribe((value: LeagueInfo) => {
      this.leagueInfo = value;
    });
    this.userService.isAdmin$().subscribe((value: boolean) => {
      this.isAdmin = value;
    });
  }

  get transactionLabel() {
    return this.leagueInfo.preSeason ? 'Asta fantamercato' : 'Mercato libero';
  }
}

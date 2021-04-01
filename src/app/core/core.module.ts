import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedService } from '@app/shared/services/shared.service';
import { SharedModule } from '@app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { reducers } from '.';
import { HeaderComponent } from './components/header/header.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LeagueInfoEffects } from './league/store/league-info.effects';
import { LeagueEffects } from './league/store/league.effects';
import { SpinnerService } from './spinner.service';
import { AuthService } from './user/services/auth.service';
import { UserEffects } from './user/store/user.effects';

@NgModule({
  declarations: [HeaderComponent, UserProfileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CollapseModule,
    SharedModule,
    BsDropdownModule,
    RouterModule,

    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([LeagueInfoEffects, LeagueEffects, UserEffects]),
    FontAwesomeModule,
  ],
  exports: [HeaderComponent, UserProfileComponent],
  providers: [SpinnerService, SharedService, AuthService],
})
export class CoreModule {}

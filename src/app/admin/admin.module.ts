import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { UsersResolverService } from '../services/resolvers/users-resolver.service';
import { AdminRoutingModule } from './admin-routing.module';
import { NewSeasonStepTwoComponent } from './new-season-step-two/new-season-step-two.component';
import { NewSeasonComponent } from './new-season/new-season.component';
import { EditLeagueComponent } from './edit-league/edit-league.component';

@NgModule({
  declarations: [
    NewSeasonComponent,
    NewSeasonStepTwoComponent,
    EditLeagueComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FlexLayoutModule,
    NgSelectModule,
    FontAwesomeModule,
    AdminRoutingModule
  ],
  providers: [
    UsersResolverService
  ]
})
export class AdminModule {
  constructor(
    library: FaIconLibrary
  ) {
    library.addIconPacks(fas);
  }
}

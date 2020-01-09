import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TeamResolverService } from '../services/resolvers/team-resolver.service';
import { UsersResolverService } from '../services/resolvers/users-resolver.service';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { EditLeagueComponent } from './edit-league/edit-league.component';
import { NewSeasonStepTwoComponent } from './new-season-step-two/new-season-step-two.component';
import { NewSeasonComponent } from './new-season/new-season.component';
import { EditComponent as PlayerEditComponent } from './players/edit/edit.component';
import { ListComponent as PlayerListComponent } from './players/list/list.component';
import { EditComponent } from './teams/edit/edit.component';
import { ListComponent } from './teams/list/list.component';
import { ParametersComponent } from './parameters/parameters.component';
import { RolesComponent } from './roles/roles.component';

@NgModule({
  declarations: [
    NewSeasonComponent,
    NewSeasonStepTwoComponent,
    EditLeagueComponent,
    ListComponent,
    EditComponent,
    PlayerListComponent,
    PlayerEditComponent,
    ParametersComponent,
    RolesComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FlexLayoutModule,
    NgSelectModule,
    PaginationModule,
    TooltipModule,
    FontAwesomeModule,
    SharedModule,
    ModalModule,
    AdminRoutingModule
  ],
  providers: [
    UsersResolverService,
    TeamResolverService
  ]
})
export class AdminModule {
  constructor(
    library: FaIconLibrary
  ) {
    library.addIconPacks(fas);
  }
}

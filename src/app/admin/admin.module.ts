import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TeamResolverService } from '../services/resolvers/team-resolver.service';
import { UsersResolverService } from '../services/resolvers/users-resolver.service';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { EditLeagueComponent } from './edit-league/edit-league.component';
import { EditComponent as FantasyTeamEditComponent } from './fantasy-teams/edit/edit.component';
import { ListComponent as FantasyTeamListComponent } from './fantasy-teams/list/list.component';
import { NewSeasonStepTwoComponent } from './new-season-step-two/new-season-step-two.component';
import { NewSeasonComponent } from './new-season/new-season.component';
import { ParametersComponent } from './parameters/parameters.component';
import { EditComponent as PlayerEditComponent } from './players/edit/edit.component';
import { ListComponent as PlayerListComponent } from './players/list/list.component';
import { RolesComponent } from './roles/roles.component';
import { RoundsComponent } from './rounds/rounds.component';
import { EditComponent as TeamEditComponent } from './teams/edit/edit.component';
import { ListComponent as TeamListComponent } from './teams/list/list.component';
import { ListComponent as UsersListComponent } from './users/list/list.component';
import { EditComponent as UserEditComponent } from './users/edit/edit.component';

@NgModule({
  declarations: [
    NewSeasonComponent,
    NewSeasonStepTwoComponent,
    EditLeagueComponent,
    FantasyTeamEditComponent,
    FantasyTeamListComponent,
    PlayerListComponent,
    PlayerEditComponent,
    ParametersComponent,
    RolesComponent,
    RoundsComponent,
    TeamListComponent,
    TeamEditComponent,
    UsersListComponent,
    UserEditComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FlexLayoutModule,
    // ngx-bootstrap
    NgSelectModule,
    PaginationModule,
    TooltipModule,
    SortableModule,
    AccordionModule,
    ModalModule,
    // fine ngx-bootstrap
    FontAwesomeModule,
    SharedModule,
    AdminRoutingModule
  ],
  providers: []
})
export class AdminModule {
  constructor(
    library: FaIconLibrary
  ) {
    library.addIconPacks(fas);
  }
}

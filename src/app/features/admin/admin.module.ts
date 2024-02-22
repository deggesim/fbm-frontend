import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AdminRoutingModule } from './admin-routing.module';
import { FantasyTeamFormComponent } from './fantasy-teams/fantasy-team-form/fantasy-team-form.component';
import { FantasyTeamListComponent } from './fantasy-teams/fantasy-team-list/fantasy-team-list.component';
import { EditLeagueComponent } from './league-edit/league-edit.component';
import { NewSeasonStepTwoComponent } from './new-season-step-two/new-season-step-two.component';
import { NewSeasonComponent } from './new-season/new-season.component';
import { ParametersComponent } from './parameters/parameters.component';
import { PlayerFormComponent } from './players/player-form/player-form.component';
import { PlayerListComponent } from './players/player-list/player-list.component';
import { RealFixtureFormComponent } from './real-fixture/real-fixture-form/real-fixture-form.component';
import { RealFixtureListComponent } from './real-fixture/real-fixture-list/real-fixture-list.component';
import { RolesComponent } from './roles/roles.component';
import { RoundsComponent } from './rounds/rounds.component';
import { TeamFormComponent } from './teams/team-form/team-form.component';
import { TeamListComponent } from './teams/team-list/team-list.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { UserListComponent } from './users/user-list/user-list.component';

@NgModule({
  declarations: [
    NewSeasonComponent,
    NewSeasonStepTwoComponent,
    EditLeagueComponent,
    FantasyTeamFormComponent,
    FantasyTeamListComponent,
    PlayerListComponent,
    PlayerFormComponent,
    ParametersComponent,
    RolesComponent,
    RoundsComponent,
    TeamListComponent,
    TeamFormComponent,
    UserListComponent,
    UserFormComponent,
    RealFixtureListComponent,
    RealFixtureFormComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CollapseModule,
    BsDropdownModule,
    PaginationModule,
    TooltipModule,
    ModalModule,
    BsDatepickerModule,
    ButtonsModule,
    AccordionModule,
    PopoverModule,
    AlertModule,
    SortableModule,
    ProgressbarModule,
    NgSelectModule,
    FontAwesomeModule,
    SharedModule,
    AdminRoutingModule,
  ],
  providers: [],
})
export class AdminModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}

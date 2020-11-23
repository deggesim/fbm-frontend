import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { EditComponent as CalendarEditComponent } from './calendar/edit/edit.component';
import { ListComponent as CalendarListComponent } from './calendar/list/list.component';
import { CompetitionsRoutingModule } from './competitions-routing.module';
import { LineupsComponent } from './lineups/lineups.component';
import { PerformancesComponent } from './performances/performances.component';
import { ResultsComponent } from './results/results.component';
import { StandingsComponent } from './standings/standings.component';

@NgModule({
  declarations: [
    CalendarListComponent,
    CalendarEditComponent,
    StandingsComponent,
    PerformancesComponent,
    LineupsComponent,
    ResultsComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FlexLayoutModule,
    // ngx-bootstrap
    NgSelectModule,
    ModalModule,
    TooltipModule,
    AccordionModule,
    SortableModule,
    PopoverModule,
    // fine ngx-bootstrap
    FontAwesomeModule,
    SharedModule,
    CompetitionsRoutingModule
  ]
})
export class CompetitionsModule { }

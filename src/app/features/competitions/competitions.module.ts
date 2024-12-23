import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
import { CalendarFormComponent } from './calendar/calendar-form/calendar-form.component';
import { CalendarListComponent } from './calendar/calendar-list/calendar-list.component';
import { CompetitionsRoutingModule } from './competitions-routing.module';
import { LineupsComponent } from './lineups/lineups.component';
import { PerformancesComponent } from './performances/performances.component';
import { ResultsComponent } from './results/results.component';
import { StandingsComponent } from './standings/standings.component';

@NgModule({
  declarations: [
    CalendarListComponent,
    CalendarFormComponent,
    StandingsComponent,
    PerformancesComponent,
    LineupsComponent,
    ResultsComponent,
  ],
  imports: [
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
    ClipboardModule,
    CompetitionsRoutingModule,
  ],
})
export class CompetitionsModule {}

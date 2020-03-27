import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../shared/shared.module';
import { EditComponent as CalendarEditComponent } from './calendar/edit/edit.component';
import { ListComponent as CalendarListComponent } from './calendar/list/list.component';
import { CompetitionsRoutingModule } from './competitions-routing.module';
import { StandingsComponent } from './standings/standings.component';
import { PerformancesComponent } from './performances/performances.component';
import { FormationsComponent } from './formations/formations.component';

@NgModule({
  declarations: [
    CalendarListComponent,
    CalendarEditComponent,
    StandingsComponent,
    PerformancesComponent,
    FormationsComponent
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
    // fine ngx-bootstrap
    FontAwesomeModule,
    SharedModule,
    CompetitionsRoutingModule
  ]
})
export class CompetitionsModule { }

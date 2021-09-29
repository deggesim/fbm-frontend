import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxBootstrapModule } from '@app/ngx-bootstrap.module';
import { SharedModule } from '@app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { CalendarFormComponent } from './calendar/calendar-form/calendar-form.component';
import { CalendarListComponent } from './calendar/calendar-list/calendar-list.component';
import { CompetitionsRoutingModule } from './competitions-routing.module';
import { LineupsComponent } from './lineups/lineups.component';
import { PerformancesComponent } from './performances/performances.component';
import { ResultsComponent } from './results/results.component';
import { StandingsComponent } from './standings/standings.component';
import { ClipboardModule } from '@angular/cdk/clipboard';

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
    FlexLayoutModule,
    NgxBootstrapModule,
    NgSelectModule,
    FontAwesomeModule,
    SharedModule,
    CompetitionsRoutingModule,
    ClipboardModule,
  ],
})
export class CompetitionsModule {}

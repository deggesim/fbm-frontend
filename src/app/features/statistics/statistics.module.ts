import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxBootstrapModule } from '@app/ngx-bootstrap.module';
import { SharedModule } from '@app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { TopFlopComponent } from './top-flop/top-flop.component';

@NgModule({
  declarations: [TopFlopComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FlexLayoutModule,
    NgxBootstrapModule,
    NgSelectModule,
    FontAwesomeModule,
    SharedModule,
    StatisticsRoutingModule,
  ],
})
export class StatisticsModule {}

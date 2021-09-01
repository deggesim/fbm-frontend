import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxBootstrapModule } from '@app/ngx-bootstrap.module';
import { SharedModule } from '@app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { TeamsRoutingModule } from './teams-routing.module';
import { TradeComponent } from './trade/trade.component';
import { TransactionComponent } from './transaction/transaction.component';

@NgModule({
  declarations: [TransactionComponent, TradeComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FlexLayoutModule,
    NgxBootstrapModule,
    NgSelectModule,
    FontAwesomeModule,
    SharedModule,
    TeamsRoutingModule,
  ],
  providers: [],
})
export class TeamsModule {}

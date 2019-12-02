import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from './transaction/transaction.component';
import { TradeComponent } from './trade/trade.component';
import { TeamsRoutingModule } from './teams-routing.module';

@NgModule({
  declarations: [
    TransactionComponent,
    TradeComponent
  ],
  imports: [
    CommonModule,
    TeamsRoutingModule,
  ],
  providers: []
})
export class TeamsModule { }

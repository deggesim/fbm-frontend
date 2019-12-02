import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TradeComponent } from './trade/trade.component';
import { TransactionComponent } from './transaction/transaction.component';

const routes: Routes = [
  {
    path: 'transactions',
    component: TransactionComponent,
    data: {
      breadcrumb: 'Mercato libero'
    }
  },
  {
    path: 'trades',
    component: TradeComponent,
    data: {
      breadcrumb: 'Scambi'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }

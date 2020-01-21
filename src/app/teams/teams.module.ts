import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TeamsRoutingModule } from './teams-routing.module';
import { TradeComponent } from './trade/trade.component';
import { TransactionComponent } from './transaction/transaction.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    TransactionComponent,
    TradeComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FlexLayoutModule,
    // ngx-bootstrap
    NgSelectModule,
    ModalModule,
    // fine ngx-bootstrap
    FontAwesomeModule,
    SharedModule,
    TeamsRoutingModule,
  ],
  providers: []
})
export class TeamsModule { }

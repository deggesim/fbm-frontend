import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SharedModule } from '../shared/shared.module';
import { TeamsRoutingModule } from './teams-routing.module';
import { TradeComponent } from './trade/trade.component';
import { TransactionComponent } from './transaction/transaction.component';

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
    TooltipModule,
    // fine ngx-bootstrap
    FontAwesomeModule,
    SharedModule,
    TeamsRoutingModule,
  ],
  providers: []
})
export class TeamsModule { }

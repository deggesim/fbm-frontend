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
import { FantasyRostersComponent } from './fantasy-rosters/fantasy-rosters.component';
import { TeamsRoutingModule } from './teams-routing.module';
import { TradeComponent } from './trade/trade.component';
import { TransactionComponent } from './transaction/transaction.component';
import { DraftBoardComponent } from './draft-board/draft-board.component';
import { RostersComponent } from './rosters/rosters.component';

@NgModule({
  declarations: [TransactionComponent, TradeComponent, FantasyRostersComponent, DraftBoardComponent, RostersComponent],
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
    TeamsRoutingModule,
  ],
  providers: [],
})
export class TeamsModule {}

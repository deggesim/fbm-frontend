import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { FantasyTeamResolverService } from '../services/resolvers/fantasy-team-resolver.service';
import { RosterResolverService } from '../services/resolvers/roster-resolver.service';
import { TradeComponent } from './trade/trade.component';
import { TransactionComponent } from './transaction/transaction.component';

const routes: Routes = [
  {
    path: 'transactions',
    component: TransactionComponent,
    data: {
      breadcrumb: 'Mercato libero'
    },
    resolve: {
      fantasyTeams: FantasyTeamResolverService,
      rosters: RosterResolverService,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'trades',
    component: TradeComponent,
    data: {
      breadcrumb: 'Scambi'
    },
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }

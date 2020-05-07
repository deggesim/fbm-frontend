import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth.guard';
import { FantasyTeamResolverService } from '@app/services/resolvers/fantasy-team-resolver.service';
import { FreePlayersResolverService } from '@app/services/resolvers/free-players-resolver.service';
import { TradeComponent } from './trade/trade.component';
import { TransactionComponent } from './transaction/transaction.component';

const routes: Routes = [
  {
    path: 'transactions',
    component: TransactionComponent,
    resolve: {
      fantasyTeams: FantasyTeamResolverService,
      rosters: FreePlayersResolverService,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'trades',
    component: TradeComponent,
    resolve: {
      fantasyTeams: FantasyTeamResolverService,
    },
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }

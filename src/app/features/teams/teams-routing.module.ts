import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/auth/service/auth.guard';
import { FantasyTeamResolverService } from '@app/shared/resolvers/fantasy-team-resolver.service';
import { FreePlayersResolverService } from '@app/shared/resolvers/free-players-resolver.service';
import { TradeComponent } from './trade/trade.component';
import { TransactionComponent } from './transaction/transaction.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'transactions',
  },
  {
    path: 'transactions',
    component: TransactionComponent,
    resolve: {
      fantasyTeams: FantasyTeamResolverService,
      rosterList: FreePlayersResolverService,
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
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule {}

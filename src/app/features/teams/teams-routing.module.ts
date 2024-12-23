import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/auth/service/auth.guard';
import { DraftBoardResolverService } from '@app/shared/resolvers/draft-board-resolver.service';
import { FantasyTeamResolverService } from '@app/shared/resolvers/fantasy-team-resolver.service';
import { FreePlayersResolverService } from '@app/shared/resolvers/free-players-resolver.service';
import { DraftBoardComponent } from './draft-board/draft-board.component';
import { FantasyRostersComponent } from './fantasy-rosters/fantasy-rosters.component';
import { RostersComponent } from './rosters/rosters.component';
import { TradeComponent } from './trade/trade.component';
import { TransactionComponent } from './transaction/transaction.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'transactions',
    pathMatch: 'full',
  },
  {
    path: 'draft-board',
    component: DraftBoardComponent,
    resolve: {
      fantasyTeams: DraftBoardResolverService,
      rosterList: FreePlayersResolverService,
    },
    canActivate: [AuthGuard],
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
  {
    path: 'fantasy-rosters',
    component: FantasyRostersComponent,
    resolve: {
      fantasyTeams: FantasyTeamResolverService,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'rosters',
    component: RostersComponent,
    resolve: {
      fantasyTeams: DraftBoardResolverService,
    },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule {}

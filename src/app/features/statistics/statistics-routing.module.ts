import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/auth/service/auth.guard';
import { FantasyTeamResolverService } from '@app/shared/resolvers/fantasy-team-resolver.service';
import { TeamResolverService } from '@app/shared/resolvers/team-resolver.service';
import { TopFlopComponent } from './top-flop/top-flop.component';

const routes: Routes = [
  {
    path: 'top-flop',
    canActivate: [AuthGuard],
    component: TopFlopComponent,
    resolve: {
      teams: TeamResolverService,
      fantasyTeams: FantasyTeamResolverService,
    },
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticsRoutingModule {}

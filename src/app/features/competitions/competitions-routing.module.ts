import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/user/services/auth.guard';
import { RealFixtureResolverService } from '@app/shared/resolvers/real-fixture-resolver.service';
import { RoundResolverService } from '@app/shared/resolvers/round-resolver.service';
import { TeamResolverService } from '@app/shared/resolvers/team-resolver.service';
import { CalendarListComponent } from './calendar/calendar-list/calendar-list.component';
import { LineupsComponent } from './lineups/lineups.component';
import { PerformancesComponent } from './performances/performances.component';
import { ResultsComponent } from './results/results.component';
import { StandingsComponent } from './standings/standings.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'calendar',
  },
  {
    path: 'calendar',
    component: CalendarListComponent,
    resolve: {
      rounds: RoundResolverService,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'standings',
    component: StandingsComponent,
    resolve: {
      rounds: RoundResolverService,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'lineups',
    component: LineupsComponent,
    resolve: {
      rounds: RoundResolverService,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'performances',
    component: PerformancesComponent,
    resolve: {
      teams: TeamResolverService,
      realFixtures: RealFixtureResolverService,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'results',
    component: ResultsComponent,
    resolve: {
      rounds: RoundResolverService,
    },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompetitionsRoutingModule {}

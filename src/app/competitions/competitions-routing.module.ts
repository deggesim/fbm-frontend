import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth.guard';
import { RealFixtureResolverService } from '@app/services/resolvers/real-fixture-resolver.service';
import { RoundResolverService } from '@app/services/resolvers/round-resolver.service';
import { TeamResolverService } from '@app/services/resolvers/team-resolver.service';
import { ListComponent as CalendarListComponent } from './calendar/list/list.component';
import { LineupsComponent } from './lineups/lineups.component';
import { PerformancesComponent } from './performances/performances.component';
import { ResultsComponent } from './results/results.component';
import { StandingsComponent } from './standings/standings.component';

const routes: Routes = [
  {
    path: 'calendar',
    component: CalendarListComponent,
    data: {
      breadcrumb: 'Calendario'
    },
    resolve: {
      rounds: RoundResolverService,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'standings',
    component: StandingsComponent,
    data: {
      breadcrumb: 'Classifiche'
    },
    resolve: {
      rounds: RoundResolverService,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'lineups',
    component: LineupsComponent,
    data: {
      breadcrumb: 'Formazioni'
    },
    resolve: {
      rounds: RoundResolverService,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'performances',
    component: PerformancesComponent,
    data: {
      breadcrumb: 'Valutazioni'
    },
    resolve: {
      teams: TeamResolverService,
      realFixtures: RealFixtureResolverService
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'results',
    component: ResultsComponent,
    data: {
      breadcrumb: 'Risultati'
    },
    resolve: {
      rounds: RoundResolverService,
    },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompetitionsRoutingModule { }

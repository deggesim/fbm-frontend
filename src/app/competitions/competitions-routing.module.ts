import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { RealFixtureResolverService } from '../services/resolvers/real-fixture-resolver.service';
import { RoundResolverService } from '../services/resolvers/round-resolver.service';
import { TeamResolverService } from '../services/resolvers/team-resolver.service';
import { ListComponent as CalendarListComponent } from './calendar/list/list.component';
import { PerformancesComponent } from './performances/performances.component';
import { StandingsComponent } from './standings/standings.component';
import { FormationsComponent } from './formations/formations.component';

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
    path: 'lineup',
    component: FormationsComponent,
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompetitionsRoutingModule { }

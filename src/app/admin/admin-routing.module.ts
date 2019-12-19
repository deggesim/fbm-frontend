import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../guards/admin.guard';
import { UsersResolverService } from '../services/resolvers/users-resolver.service';
import { EditLeagueComponent } from './edit-league/edit-league.component';
import { NewSeasonStepTwoComponent } from './new-season-step-two/new-season-step-two.component';
import { NewSeasonComponent } from './new-season/new-season.component';
import { LeagueResolverService } from '../services/resolvers/league-resolver.service';
import { ListComponent } from './teams/list/list.component';
import { TeamResolverService } from '../services/resolvers/team-resolver.service';

const routes: Routes = [
  {
    path: 'new-season',
    data: {
      breadcrumb: 'Nuova stagione'
    },
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'step-one'
      },
      {
        path: 'step-one',
        component: NewSeasonComponent,
        data: {
          breadcrumb: 'Dati lega'
        },
      },
      {
        path: 'step-two',
        component: NewSeasonStepTwoComponent,
        data: {
          breadcrumb: 'Fantasquadre'
        },
        resolve: {
          users: UsersResolverService
        },
      },
    ],
  },
  {
    path: 'edit-league',
    component: EditLeagueComponent,
    data: {
      breadcrumb: 'Impostazioni'
    },
    resolve: {
      league: LeagueResolverService,
    },
    canActivate: [AdminGuard],
  },
  {
    path: 'teams',
    component: ListComponent,
    data: {
      breadcrumb: 'Squadre'
    },
    resolve: {
      users: TeamResolverService
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

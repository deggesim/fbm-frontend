import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@app/guards/admin.guard';
import { FantasyTeamResolverService } from '@app/services/resolvers/fantasy-team-resolver.service';
import { LeagueResolverService } from '@app/services/resolvers/league-resolver.service';
import { RosterResolverService } from '@app/services/resolvers/roster-resolver.service';
import { RoundResolverService } from '@app/services/resolvers/round-resolver.service';
import { TeamResolverService } from '@app/services/resolvers/team-resolver.service';
import { UsersResolverService } from '@app/services/resolvers/users-resolver.service';
import { EditLeagueComponent } from './edit-league/edit-league.component';
import { ListComponent as FantasyTeamListComponent } from './fantasy-teams/list/list.component';
import { NewSeasonStepTwoComponent } from './new-season-step-two/new-season-step-two.component';
import { NewSeasonComponent } from './new-season/new-season.component';
import { ParametersComponent } from './parameters/parameters.component';
import { ListComponent as PlayerListComponent } from './players/list/list.component';
import { RolesComponent } from './roles/roles.component';
import { RoundsComponent } from './rounds/rounds.component';
import { ListComponent as TeamListComponent } from './teams/list/list.component';
import { ListComponent as UserListComponent } from './users/list/list.component';

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
    path: 'preseason',
    data: {
      breadcrumb: 'Preseason'
    },
    canActivate: [AdminGuard],
    children: [
      {
        path: 'edit-league',
        component: EditLeagueComponent,
        data: {
          breadcrumb: 'Impostazioni'
        },
        resolve: {
          league: LeagueResolverService,
        },
      },
      {
        path: 'parameters',
        component: ParametersComponent,
        data: {
          breadcrumb: 'Parametri'
        },
      },
      {
        path: 'teams',
        component: TeamListComponent,
        data: {
          breadcrumb: 'Squadre'
        },
        resolve: {
          teams: TeamResolverService
        },
      },
      {
        path: 'roles',
        component: RolesComponent,
        data: {
          breadcrumb: 'Ruoli'
        },
      },
      {
        path: 'players',
        component: PlayerListComponent,
        data: {
          breadcrumb: 'Giocatori'
        },
        resolve: {
          rosters: RosterResolverService
        },
      },
    ],
  },
  {
    path: 'league-management',
    data: {
      breadcrumb: 'Gestione lega'
    },
    canActivate: [AdminGuard],
    children: [
      {
        path: 'fantasy-teams',
        component: FantasyTeamListComponent,
        data: {
          breadcrumb: 'Fantasquadre'
        },
        resolve: {
          fantasyTeams: FantasyTeamResolverService
        },
      },
      {
        path: 'rounds',
        component: RoundsComponent,
        data: {
          breadcrumb: 'Gestione turni'
        },
        resolve: {
          rounds: RoundResolverService,
          fantasyTeams: FantasyTeamResolverService
        },
      },
    ],
  },
  {
    path: 'users',
    component: UserListComponent,
    data: {
      breadcrumb: 'Gestione utenti'
    },
    resolve: {
      users: UsersResolverService
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

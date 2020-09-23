import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@app/guards/admin.guard';
import { FantasyTeamResolverService } from '@app/services/resolvers/fantasy-team-resolver.service';
import { LeagueResolverService } from '@app/services/resolvers/league-resolver.service';
import { RealFixtureResolverService } from '@app/services/resolvers/real-fixture-resolver.service';
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
import { ListComponent as RealFixtureListComponent } from './real-fixture/list/list.component';
import { RolesComponent } from './roles/roles.component';
import { RoundsComponent } from './rounds/rounds.component';
import { ListComponent as TeamListComponent } from './teams/list/list.component';
import { ListComponent as UserListComponent } from './users/list/list.component';

const routes: Routes = [
  {
    path: 'new-season',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'step-one'
      },
      {
        path: 'step-one',
        component: NewSeasonComponent,
      },
      {
        path: 'step-two',
        component: NewSeasonStepTwoComponent,
        resolve: {
          users: UsersResolverService
        },
      },
    ],
  },
  {
    path: 'preseason',
    canActivate: [AdminGuard],
    children: [
      {
        path: 'edit-league',
        component: EditLeagueComponent,
        resolve: {
          league: LeagueResolverService,
        },
      },
      {
        path: 'parameters',
        component: ParametersComponent,
      },
      {
        path: 'teams',
        component: TeamListComponent,
        resolve: {
          teams: TeamResolverService
        },
      },
      {
        path: 'roles',
        component: RolesComponent,
      },
      {
        path: 'players',
        component: PlayerListComponent,
        resolve: {
          rosterList: RosterResolverService
        },
      },
    ],
  },
  {
    path: 'league-management',
    canActivate: [AdminGuard],
    children: [
      {
        path: 'teams',
        component: TeamListComponent,
        resolve: {
          teams: TeamResolverService
        },
      },
      {
        path: 'players',
        component: PlayerListComponent,
        resolve: {
          rosterList: RosterResolverService
        },
      },
      {
        path: 'fantasy-teams',
        component: FantasyTeamListComponent,
        resolve: {
          fantasyTeams: FantasyTeamResolverService
        },
      },
      {
        path: 'rounds',
        component: RoundsComponent,
        resolve: {
          rounds: RoundResolverService,
          fantasyTeams: FantasyTeamResolverService
        },
      },
      {
        path: 'real-fixtures',
        component: RealFixtureListComponent,
        resolve: {
          realFixtures: RealFixtureResolverService,
        },
      },
    ],
  },
  {
    path: 'users',
    component: UserListComponent,
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

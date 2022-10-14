import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeagueResolverService } from '@app/core/league/services/league-resolver.service';
import { AdminGuard } from '@app/core/user/services/admin.guard';
import { UsersResolverService } from '@app/core/user/services/users-resolver.service';
import { FantasyTeamResolverService } from '@app/shared/resolvers/fantasy-team-resolver.service';
import { RealFixtureResolverService } from '@app/shared/resolvers/real-fixture-resolver.service';
import { RosterResolverService } from '@app/shared/resolvers/roster-resolver.service';
import { RoundResolverService } from '@app/shared/resolvers/round-resolver.service';
import { TeamResolverService } from '@app/shared/resolvers/team-resolver.service';
import { FantasyTeamListComponent } from './fantasy-teams/fantasy-team-list/fantasy-team-list.component';
import { EditLeagueComponent } from './league-edit/league-edit.component';
import { NewSeasonStepTwoComponent } from './new-season-step-two/new-season-step-two.component';
import { NewSeasonComponent } from './new-season/new-season.component';
import { ParametersComponent } from './parameters/parameters.component';
import { PlayerListComponent } from './players/player-list/player-list.component';
import { RealFixtureListComponent } from './real-fixture/real-fixture-list/real-fixture-list.component';
import { RolesComponent } from './roles/roles.component';
import { RoundsComponent } from './rounds/rounds.component';
import { TeamListComponent } from './teams/team-list/team-list.component';
import { UserListComponent } from './users/user-list/user-list.component';

const routes: Routes = [
  {
    path: 'new-season',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'step-one',
        pathMatch: 'full',
      },
      {
        path: 'step-one',
        component: NewSeasonComponent,
      },
      {
        path: 'step-two',
        component: NewSeasonStepTwoComponent,
        resolve: {
          users: UsersResolverService,
        },
      },
    ],
  },
  {
    path: 'preseason',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'edit-league',
        pathMatch: 'full',
      },
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
          teams: TeamResolverService,
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
          teams: TeamResolverService,
          rosterList: RosterResolverService,
        },
      },
    ],
  },
  {
    path: 'league-management',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'teams',
        pathMatch: 'full',
      },
      {
        path: 'teams',
        component: TeamListComponent,
        resolve: {
          teams: TeamResolverService,
        },
      },
      {
        path: 'players',
        component: PlayerListComponent,
        resolve: {
          teams: TeamResolverService,
          rosterList: RosterResolverService,
        },
      },
      {
        path: 'fantasy-teams',
        component: FantasyTeamListComponent,
        resolve: {
          users: UsersResolverService,
          fantasyTeams: FantasyTeamResolverService,
        },
      },
      {
        path: 'rounds',
        component: RoundsComponent,
        resolve: {
          rounds: RoundResolverService,
          fantasyTeams: FantasyTeamResolverService,
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
      users: UsersResolverService,
    },
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

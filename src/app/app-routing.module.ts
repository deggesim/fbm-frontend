import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/auth/service/auth.guard';
import { ErrorPageComponent } from '@app/shared/components/error-page.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then((mod) => mod.HomeModule),
  },
  {
    path: 'teams',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/teams/teams.module').then((mod) => mod.TeamsModule),
  },
  {
    path: 'competitions',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/competitions/competitions.module').then((mod) => mod.CompetitionsModule),
  },
  {
    path: 'statistics',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/statistics/statistics.module').then((mod) => mod.StatisticsModule),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/admin/admin.module').then((mod) => mod.AdminModule),
  },
  { path: 'error', component: ErrorPageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

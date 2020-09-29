import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from '@app/shared/components/error-page.component';
import { AuthGuard } from '@app/shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(mod => mod.HomeModule),
  },
  {
    path: 'teams',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/teams/teams.module').then(mod => mod.TeamsModule),
  },
  {
    path: 'competitions',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/competitions/competitions.module').then(mod => mod.CompetitionsModule),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/admin/admin.module').then(mod => mod.AdminModule),
  },
  { path: 'error', component: ErrorPageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

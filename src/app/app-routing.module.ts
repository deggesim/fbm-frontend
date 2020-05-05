import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { ErrorPageComponent } from './shared/error-page.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'teams',
    canActivate: [AuthGuard],
    loadChildren: () => import('./teams/teams.module').then(mod => mod.TeamsModule),
  },
  {
    path: 'competitions',
    canActivate: [AuthGuard],
    loadChildren: () => import('./competitions/competitions.module').then(mod => mod.CompetitionsModule),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule),
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../guards/admin.guard';
import { NewSeasonComponent } from './new-season/new-season.component';
import { NewSeasonStepTwoComponent } from './new-season-step-two/new-season-step-two.component';
import { UsersResolverService } from '../services/resolvers/users-resolver.service';

const routes: Routes = [
  {
    path: 'new-season',
    data: {
      breadcrumb: 'Nuova stagione'
    },
    // canActivate: [AdminGuard],
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
          breadcrumb: 'Squadre'
        },
        resolve: {
          users: UsersResolverService
        },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../guards/admin.guard';
import { NewSeasonComponent } from './new-season/new-season.component';

const routes: Routes = [
  {
    path: 'new-season',
    component: NewSeasonComponent,
    data: {
      breadcrumb: 'Nuova stagione'
    },
    // canActivate: [AdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

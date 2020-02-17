import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { RoundResolverService } from '../services/resolvers/round-resolver.service';
import { ListComponent as CalendarListComponent} from './calendar/list/list.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompetitionsRoutingModule { }

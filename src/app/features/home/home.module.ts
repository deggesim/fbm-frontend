import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxBootstrapModule } from '@app/ngx-bootstrap.module';
import { SharedModule } from '@app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home', breadcrumb: 'Home' },
  },
];

@NgModule({
  declarations: [HomeComponent, LoginComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FlexLayoutModule,
    NgxBootstrapModule,
    FontAwesomeModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class HomeModule {}

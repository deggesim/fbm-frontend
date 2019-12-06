import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminRoutingModule } from './admin-routing.module';
import { NewSeasonComponent } from './new-season/new-season.component';

@NgModule({
  declarations: [
    NewSeasonComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FlexLayoutModule,
    NgSelectModule,
    FontAwesomeModule,
    AdminRoutingModule
  ]
})
export class AdminModule {
  constructor(
    library: FaIconLibrary
  ) {
    library.addIconPacks(fas);
  }
}

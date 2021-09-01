import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { AuthInterceptor } from '@app/core/auth/service/auth-interceptor.service';
import { SharedModule } from '@app/shared/shared.module';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ToastContainerModule, ToastrModule } from 'ngx-toastr';
import { CoreModule } from './core/core.module';
import { GlobalInterceptor } from './core/global-interceptor.service';
import { TenantInterceptor } from './core/league/services/tenant-interceptor.service';
import { NgxBootstrapModule } from './ngx-bootstrap.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    NgSelectModule,
    NgxBootstrapModule,
    NgxChartsModule,
    ToastrModule.forRoot(),
    ToastContainerModule,
    FontAwesomeModule,
    AppRoutingModule,
    CoreModule,
    SharedModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TenantInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: GlobalInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}

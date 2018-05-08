import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  Router,
  RouterModule,
  // import as RouterEvent to avoid confusion with the DOM Event
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { routes } from './app.routes';

import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { LogoutModule } from './logout/logout.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LoggedInGuard } from './shared/logged-in.guard';
import { AdministratorGuard } from './shared/administrator.guard';
import { UserService } from './services/user.service';
import { EstimateService } from './services/estimate.service';
import { SpinnyModule } from './shared/spinny/spinny.module';
import { ClientService } from './services/client.service';
import { PriceSheetService } from './services/price-sheet.service';
import { CategoryService } from './services/category.service';
import { LevelService } from './services/level.service';
import { LookupService } from './services/lookup.service';

import { SecureHttp } from './shared/secure-http';

import { EstimateStatusService } from './services/estimate-status.service';
import { BrandService } from './services/brand.service';
import { BillingNumberService } from './services/billing-number.service';
import { ComponentItemService } from './services/component-item.service';

import { SpinnyService } from './shared/spinny/spinny.service';
import { ToastsManager, ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ToastModule.forRoot(),
    LoginModule,
    DashboardModule,
    SpinnyModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    LoggedInGuard,
    UserService,
    AdministratorGuard,
    EstimateService,
    ClientService,
    SecureHttp,
    PriceSheetService,
    CategoryService,
    LevelService,
    EstimateStatusService,
    BrandService,
    BillingNumberService,
    ComponentItemService,
    LookupService],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private router: Router, private route: Router, private spinnyService: SpinnyService) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart && !(this.route.url.indexOf(event.url) > -1)) {
      this.spinnyService.start();
    }

    if (event instanceof NavigationCancel) {
      this.spinnyService.stop();
    }
    if (event instanceof NavigationError) {
      this.spinnyService.stop();
    }
  }

}

import { Routes } from '@angular/router';
import { LoginRoutes, LoginComponent } from './login/index';
import { LogoutRoutes } from './logout';
import { DashboardRoutes } from './dashboard/index';

export const routes: Routes = [
    ...LoginRoutes,
    ...DashboardRoutes,
    ...LogoutRoutes,
    { path: '**', component: LoginComponent }
];

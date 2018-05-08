import { EstimateRoutes } from './estimate/estimate.routes';
import { Route } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { LoggedInGuard } from '../shared/logged-in.guard';
import { LogoutRoutes } from '../logout/logout.routes';


export const DashboardRoutes: Route[] = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [LoggedInGuard],
        children: [
            ...EstimateRoutes,
            ...LogoutRoutes,
        ]
    }
];

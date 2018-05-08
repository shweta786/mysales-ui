import { Route } from '@angular/router';

import { EstimateComponent } from './estimate.component';
import { LoggedInGuard } from '../../shared/logged-in.guard';

export const EstimateRoutes: Route[] = [
    {
        path: 'estimates',
        component: EstimateComponent,
        canActivate: [LoggedInGuard]
    }
];

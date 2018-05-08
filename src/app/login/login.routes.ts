import { Route } from '@angular/router';
import { LoginComponent } from './login.component';
// import { ResetPasswordRoutes } from './reset-password/reset-password.routes';
// import { ChangePasswordRoutes } from './change-password/change-password.routes';

export const LoginRoutes: Route[] = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    // ...ResetPasswordRoutes,
    // ...ChangePasswordRoutes
];

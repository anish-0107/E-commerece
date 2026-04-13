import { Routes } from '@angular/router';
import { AuthGuard } from './core/guard/Authguard/authguard-guard';
import { roleguardGuard } from './core/guard/roleguard/roleguard-guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./Auth/auth-Routes').then(m => m.AuthRoutes)
    },
    { 
        path:'admin',
        canActivate:[AuthGuard, roleguardGuard],
        loadChildren: ()=> import('./admin/admin.routes').then(m=>m.Admin_Routes)
    },
    {
        path:'user',
        loadChildren:()=> import('./Customer/user-routes')  .then(m=>m.UserRoutes)
    }
];

import { Routes } from "@angular/router";

export const AuthRoutes:Routes=[
    {
        path:'login',
        loadComponent:() => import('./login/login').then(m=>m.Login)
    },
    {
        path:'forgot-password',
        loadComponent:() => import('./forgot-pass/forgot-pass').then(m=>m.ForgotPass)
    },
    {
        path:'profile',
        loadComponent:() => import('../Customer/profile/profile').then(m=>m.Profile)
    },
    {
        path:'register',
        loadComponent:() => import('./register/register').then (m=>m.Register)
    }
]
import { Routes } from "@angular/router";

export const Admin_Routes :Routes=[
    {
        path:'addtype',
        loadComponent:()=> import('./manage-taxonomy/manage-taxonomy').then(m=>m.ManageTaxonomy)
    },
    {
        path:'products',
        loadComponent:()=> import('./manage-products/manage-products') .then(m=>m.ManageProducts)
    },
    {
        path:'dashboard',
        loadComponent :()=> import('./dashboard/dashboard') .then (m=>m.Dashboard)
    },
    {
        path:'user',
        loadComponent:() => import('./user-mangemnet/user-mangemnet') .then(m=>m.UserMangemnet)
    }
]
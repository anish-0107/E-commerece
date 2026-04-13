import { Routes } from '@angular/router';
import { AuthGuard } from '../core/guard/Authguard/authguard-guard';


export const  UserRoutes:Routes = [
  {
    path:'',
    loadComponent:() => import ('./products/products').then(m=>m.Products)
  },
  {
    path:'main',
    loadComponent:() => import('./products/products').then(m=>m.Products)
  },
  {
    path:'productsDetails/:id',
    loadComponent:() =>import('./product-detils/product-detils') .then(m=>m.ProductDetils)
  },
  {
    path:'cart',
    canActivate:[AuthGuard],
    loadComponent:() => import('./cart/cart').then(m=>m.Cart)
  },
  {
    path:'order',
    canActivate:[AuthGuard],
    loadComponent:() =>import('./orders/orders').then (m=>m.Orders)
  },
  {
    path:'orderDetails/:id',
    canActivate:[AuthGuard],
    loadComponent:() =>import('./orders-details/orders-details').then(m=>m.OrdersDetails)
  }
]

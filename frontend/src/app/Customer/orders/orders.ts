import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UserService } from '../user-service';
import { Order } from '../../models/cart-order';
import { UpperCasePipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-orders',
  imports: [UpperCasePipe, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  ngOnInit(): void {
    this.getOrderHistory()
  }

  private userServ = inject(UserService)
  private cdr = inject(ChangeDetectorRef)
  orderHistory: Order[] = []


  getOrderHistory() {
    this.userServ.allOrders().subscribe({
      next: (data: any) => {
        console.log(data,"this is history");
        this.orderHistory = data
        this.cdr.detectChanges()
      }
    })
  }

}

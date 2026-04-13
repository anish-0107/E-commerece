import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Adminservice } from '../adminservice';
import { Order } from '../../models/cart-order';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, UpperCasePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  ngOnInit(): void {
    this.allorders()
  }

  private admserv = inject(Adminservice)
  orders: Order[] = []
  private cdr = inject(ChangeDetectorRef)

  allorders() {
    this.admserv.getAllOrders().subscribe({
      next: (data: any) => {
        // console.log(data);
        this.orders = data.data
        console.log(this.orders);
        this.cdr.detectChanges()
      }
    })
  }
}

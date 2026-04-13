import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UserService } from '../user-service';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../models/cart-order';
import { AsyncPipe, DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-orders-details',
  imports: [UpperCasePipe, DatePipe, AsyncPipe],
  templateUrl: './orders-details.html',
  styleUrl: './orders-details.css',
})
export class OrdersDetails implements OnInit {
  orderId: string | null = null;
  details!:Order

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    console.log('The Order ID is:', this.orderId);
    
    if (this.orderId) {
      this.orderDetails(parseInt(this.orderId));
    }
  }
  private userServ = inject(UserService)
  private route = inject(ActivatedRoute);
  private  cdr = inject(ChangeDetectorRef)

  orderDetails(id: number) {
    this.userServ.getOrderDetail(id).subscribe({
      next: (data:any) => {
        console.log("entered");
        this.details =data.deatils
        console.log(data);
        this.cdr.detectChanges()
      }
    })
  }
}

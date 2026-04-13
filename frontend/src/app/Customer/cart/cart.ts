import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UserService } from '../user-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cartItems: any[] = [];

  private qtyUpdate$ = new Subject<{ id: number, change: number }>();

  ngOnInit(): void {
    this.getCart()
    this.cartTotal()
  }

  constructor() {
    this.placeOrderForm = this.fb.group({
      payMethod: ['', [Validators.required]]
    });




    this.qtyUpdate$.pipe(
    // Wait 400ms after the last click before calling the API
    debounceTime(400) 
  ).subscribe(({ id, change }) => {
    // This only runs after the user stops tapping
    this.userServ.upadateQuantity(id, change).subscribe({
      next: (res) => {
        const item = this.cartItems.find(i => i.id === id);
        if (item) {
          // IMPORTANT: Check if 'res' is an object or number
          // If the backend returns { quantity: 5 }, use res.quantity
          // item.quantity = typeof res === 'object' ? res.quantity : res;
        }
      },
      error: (err) => console.error("Sync failed", err)
    });
  });
  }

  private userServ = inject(UserService)
  private cdr = inject(ChangeDetectorRef)
  private fb = inject(FormBuilder)
  public total: number = 0

  placeOrderForm!: FormGroup
  isShownForm: boolean = false
  confirmOrderpop: boolean = false


  getCart() {
    this.userServ.getCart().subscribe({
      next: (data: any) => {
        this.cartItems = data
        console.log(this.cartItems, "cart");
        this.cdr.detectChanges()
      }
    })
  }

 updateQty(cartItemId: number, change: number) {
  // 1. Find the item
  const item = this.cartItems.find(i => i.id === cartItemId);

  if (item) {
    const originalQty = item.quantity; // Save for potential rollback
    const targetQty = item.quantity + change;

    if (targetQty < 1) return;

    // 2. OPTIMISTIC UPDATE: Update UI immediately
    item.quantity = targetQty;

    // 3. Call backend in the background
    this.userServ.upadateQuantity(cartItemId, change).subscribe({
      next: (res) => {
        // Synchronize with server's exact value (optional but recommended)
        item.quantity = res; 
        console.log("Quantity synced successfully");
      },
      error: (err) => {
        console.error("Failed to update quantity, reverting...", err);
        // 4. ROLLBACK: If server fails, undo the local change
        item.quantity = originalQty;
        // Trigger a toast message or alert to notify the user
      }
    });
  }
}

  deleteItemFormCart(id: number) {
    this.userServ.removeItem(id).subscribe({
      next: (data) => {
        console.log(data);
      }
    })
  }

  clearCart() {
    this.userServ.clearCart().subscribe({
      next: (data) => {
        console.log("cart cleared");
        this.cdr.detectChanges()
         window.location.reload()
      }
    })
  }

  cartTotal() {
    this.userServ.cartTotal().subscribe({
      next: (data: any) => {
        // console.log(data);
        this.total = data.data.totalAmount
        // console.log(this.total);
        this.cdr.detectChanges()
      }
    })
  }

  placeOrder() {
    this.userServ.placeOrder(this.placeOrderForm.value).subscribe({
      next: (data) => {
        this.closepopup()
        console.log(data);
      }
    })
  }

  beforePlaceOrder() {
    this.isShownForm = true
  }

  closepopup() {
    this.isShownForm = false
  }

  confirmOrderPopUp() {
    this.confirmOrderpop = true
  }

  closeorderPopUp() {
    this.confirmOrderpop = false
  }

}

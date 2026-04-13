import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = "http://localhost:3005"
  private http = inject(HttpClient)

  addTocart(productId:number,quantity:number){
    return this.http.post(`${this.apiUrl}/cart/add`,{productId,quantity})
  }

  getCart(){
    return this.http.get(`${this.apiUrl}/cart/get`)
  }

  upadateQuantity(cartItemId: number,change:number){
    return this.http.post(`${this.apiUrl}/cart/update`,{cartItemId,change})
  }

  removeItem(id:number){
    return this.http.delete(`${this.apiUrl}/cart/delete/${id}`)
  }

  clearCart(){
    return this.http.get(`${this.apiUrl}/cart/clear`)
  }

  allOrders(){
    return this.http.get(`${this.apiUrl}/order/history`)
  }

  cartTotal(){
    return this.http.get(`${this.apiUrl}/cart/cartTotal`)
  }

  getOrderDetail(id:number){
    return this.http.get(`${this.apiUrl}/order/details/${id}`)
  }

  placeOrder(data:any){
    return this.http.post(`${this.apiUrl}/order/place`,data)
  }

  productDetails(id:number){
    return this.http.get(`${this.apiUrl}/prod/getsingle/${id}`)
  }
}

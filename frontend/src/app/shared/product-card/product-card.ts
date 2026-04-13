import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { product } from '../../models/product-model';
import { AuthService } from '../../Auth/auth-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard implements OnInit {
  ngOnInit(): void {
    this.isLoggedIn()
  }

  @Input() products!: product[]
  @Input() currentUserData: any = null;

  // emit event when action is trigger to get know to parent thne parnt catch event perform action
  @Output() addToCart = new EventEmitter<product>()
  @Output() delete = new EventEmitter<product>()
  @Output() edit = new EventEmitter<product>()
  @Output() addCart = new EventEmitter<product>()

  getImageUrl(prod: product) {
    return `http://localhost:3005${prod.imagePath}`
  }

  public authServ = inject(AuthService)


  isLoggedIn() {
    this.authServ.currentUser$.subscribe(data => {
      this.currentUserData = data
    })
  }
}

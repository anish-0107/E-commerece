import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { UserService } from '../user-service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/taxonomy-model';
import { product } from '../../models/product-model';

@Component({
  selector: 'app-product-detils',
  imports: [],
  templateUrl: './product-detils.html',
  styleUrl: './product-detils.css',
})
export class ProductDetils {

  prodDetails!:product
  prodId!:string | null
  isCopied :boolean=false

  prodid = Number(this.prodId)

  private userServ = inject(UserService)
  private route = inject(ActivatedRoute);
  private  cdr = inject(ChangeDetectorRef)

  ngOnInit(): void {
    this.prodId = this.route.snapshot.paramMap.get('id');
    console.log('The Order ID is:', this.prodId);
    
    if (this.prodId) {
       this.productDetails(parseInt(this.prodId));
    }
  }

  productDetails(id:number){
    this.userServ.productDetails(id).subscribe({
      next:(data:any)=>{
        // console.log(data);
        this.prodDetails = data
        console.log(this.prodDetails);
        this.cdr.detectChanges()
        
      }
    })
  }
    getImageUrl(prod: product) {
    return `http://localhost:3005${prod.imagePath}`
  }

 addToCart() {
    this.userServ.addTocart(this.prodDetails.id, 1).subscribe({
      next: (data) => {
        console.log(this.prodDetails.id);
        console.log(data);
      }
    })
  }


  sharepath(){
    const finalUrl = (window.location.href);

    navigator.clipboard.writeText(finalUrl).then(() => {
    this.isCopied = true;
    console.log("URL Copied:", finalUrl);

    // Reset the state after 2 seconds
    setTimeout(() => {
      this.isCopied = false;
    }, 2000);
  }).catch(err => {
    console.error('Could not copy text: ', err);
  });
  }


  
showMessage = false;
toastMessage = '';
isError = false;

triggerMessage(msg: string, type: 'success' | 'error' = 'success') {
  this.toastMessage = msg;
  this.isError = type === 'error';
  this.showMessage = true;

  // Auto-hide after 3 seconds
  setTimeout(() => {
    this.showMessage = false;
  }, 3000);
}
}

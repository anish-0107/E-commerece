import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Adminservice } from '../../admin/adminservice';
import { Product } from '../../models/taxonomy-model';
import { ProductCard } from "../../shared/product-card/product-card";
import { product } from '../../models/product-model';
import { Sidebar } from "../../shared/sidebar/sidebar";
import { SharedService } from '../../shared/shared-service';
import { UserService } from '../user-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [ProductCard, Sidebar, ReactiveFormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {

  /** Inclusive range start for the “showing X–Y of Z” line (1-based). */
  get showingFrom(): number {
    if (this.totalCount === 0) {
      return 0;
    }
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  /** Inclusive range end for the “showing X–Y of Z” line. */
  get showingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalCount);
  }

  ngOnInit(): void {
    this.getAllproducts()

    this.searchControl.valueChanges.pipe(
      debounceTime(5),
      distinctUntilChanged()
    ).subscribe(val => {
      this.currentPage = 1
      this.getAllproducts()
    })
  }

  searchControl = new FormControl('')

  allProducts: product[] = []
  totalCount = 0;
  currentPage = 1;
  pageSize = 8;

  currentFilters: any = {}

  private admserv = inject(Adminservice)
  private shareServ = inject(SharedService)
  private userServ = inject(UserService)
  private cdr = inject(ChangeDetectorRef)

  getAllproducts() {

    const filters = {
      ...this.currentFilters,
      query: this.searchControl.value || '' // Ensure text search is always included
    };

    if (!filters.query) {
      delete filters.query;
    }

    this.shareServ.getSearchedProducts(this.currentPage, this.pageSize, filters).subscribe({
      next: (data: any) => {
        this.allProducts = data.data
        this.totalCount = data.totalCount
        this.cdr.detectChanges()
      }
    })
  }

  changePage(newPage: number) {
    this.currentPage = newPage
    this.getAllproducts()
  }

  onSidebarFilter(filters: any) {
    this.currentFilters = filters; // Save the filters

    if (filters.query !== undefined) {
      this.searchControl.setValue(filters.query, { emitEvent: false });
    }
    this.currentPage = 1;          // Reset to page 1 on new search
    this.getAllproducts();

  }

  addToCart(product: product) {
    console.log(product.id);
    this.userServ.addTocart(product.id, 1).subscribe({
      next: (data) => {
        console.log(data);
      }
    })
  }


}

import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Adminservice } from '../adminservice';
import { SubCategory } from '../../models/taxonomy-model';
import { product } from '../../models/product-model';
import { ProductCard } from "../../shared/product-card/product-card";
import { Sidebar } from "../../shared/sidebar/sidebar";
import { SharedService } from '../../shared/shared-service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-manage-products',
  standalone: true, // Assuming standalone based on previous context
  imports: [ReactiveFormsModule, ProductCard, Sidebar],
  templateUrl: './manage-products.html',
  styleUrl: './manage-products.css',
})
export class ManageProducts implements OnInit {
  // Logic States
  allProducts: product[] = [];
  allCate: SubCategory[] = [];
  totalCount = 0;
  currentPage = 1;
  pageSize = 8; // Kept at 5 to match your Products logic
  currentFilters: any = {};
  searchControl = new FormControl('');

  // UI States
  mode: 'customer' | 'admin' = 'admin';
  editForm: boolean = false;
  addform:boolean=false
  selectProduct: any = null;
  selectedFile: File | null = null;
  selectedFileName: string = '';

  // Forms
  addProductForm: FormGroup;
  UpdateProductForm: FormGroup;

  // Dependencies
  private admservice = inject(Adminservice);
  private shareServ = inject(SharedService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.addProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.min(1)]],
      Stockquantity: ['', [Validators.required]],
      subcategoryId: ['', [Validators.required]]
    });

    this.UpdateProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.min(1)]],
      Stockquantity: ['', [Validators.required]],
      subcategoryId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getAllcategories();
    this.loadProducts(); // Initial Load

    // Listen to Search Control changes
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadProducts();
    });
  }

  /**
   * Centralized Load Function
   * Merges Sidebar Filters + Search Input + Pagination
   */
  loadProducts() {
    // Construct the final object
  // If searchControl is empty, we explicitly set query to an empty string
  const filters = {
    ...this.currentFilters,
    query: this.searchControl.value || '' 
  };

  // CLEAN UP: If the query is empty, you might want to delete the key 
  // so the backend doesn't try to filter by an empty string
  if (!filters.query) {
    delete filters.query;
  }

    this.shareServ.getSearchedProducts(this.currentPage, this.pageSize, filters).subscribe({
      next: (res: any) => {
        // Backend returns { data: product[], totalCount: number }
        this.allProducts = res.data;
        this.totalCount = res.totalCount;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error loading products", err)
    });
  }

  // Handle Sidebar Filter events
  onSideBarFilter(filterData: any) {
    this.currentFilters = filterData;
    if (filterData.query !== undefined) {
    this.searchControl.setValue(filterData.query, { emitEvent: false });
  }

    this.currentPage = 1;
    this.loadProducts();
  }

  // Handle Pagination
  changePage(newPage: number) {
    this.currentPage = newPage;
    this.loadProducts();
  }

  /* --- Admin Actions (Add/Update/Delete) --- */

  addProduct() {
    if (this.addProductForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('imagePath', this.selectedFile, this.selectedFile.name);
      formData.append('name', this.addProductForm.value.name);
      formData.append('description', this.addProductForm.value.description);
      formData.append('price', this.addProductForm.value.price);
      formData.append('Stockquantity', this.addProductForm.value.Stockquantity);
      formData.append('subcategoryId', this.addProductForm.value.subcategoryId);

      this.admservice.addProduct(formData).subscribe({
        next: () => {
          this.addProductForm.reset();
          this.selectedFile = null;
          this.loadProducts(); // Refresh list
        },
        error: (err) => console.log(err)
      });
    }
  }

  deleteProduct(product: product) {
    if (confirm(`Delete ${product.name}?`)) {
      this.admservice.deleteProduct(product.id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.log(err)
      });
    }
  }

  onUpdate() {
    if (this.UpdateProductForm.valid && this.selectProduct) {
      this.admservice.updateProduct(this.selectProduct.id, this.UpdateProductForm.value).subscribe({
        next: () => {
          this.editForm = false;
          this.loadProducts();
        }
      });
    }
  }

  /* --- UI Helpers --- */

  editProduct(prod: product) {
    this.editForm = true;
    this.selectProduct = prod;
    this.UpdateProductForm.patchValue({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      Stockquantity: prod.Stockquantity,
      subcategoryId: prod.category?.id // Note: using category.id based on common entity structures
    });
  }

  onFileSelected(event: any) {
    const file = event?.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  getAllcategories() {
    this.admservice.getAllSubCate().subscribe({
      next: (data: any) => {
        this.allCate = data.alltypes;
      }
    });
  }

  cancelEdit() {
    this.editForm = false;
    this.selectProduct = null;
  }

  showAddForm(){
    this.addform =true
  }

  closeForm(){
    this.addform =false
  }
}
import { Component, EventEmitter, Output, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Adminservice } from '../../admin/adminservice';
import { type } from '../../models/taxonomy-model';
import { FilterState } from '../../models/product-model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {

  private admserv = inject(Adminservice);
  private cdr = inject(ChangeDetectorRef);


  @Output() filterChanged = new EventEmitter<FilterState>();


  allTaxo: type[] = [];
  expandedCategories = new Set<number>();

  searchQuery: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedTypeId: number | null = null;
  selectedCategoryId: number | null = null;
  selectedSubCategoryId: number | null = null;

  // Debounce stream to prevent lag and multiple rapid API calls
  private filterStream = new Subject<void>();

  ngOnInit(): void {
    this.getAlltaxonomy();

    // Consolidate all changes and emit after 300ms of "silence"
    this.filterStream.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.emitConsolidatedFilters();
    });
  }

  getAlltaxonomy() {
    this.admserv.getTaxonomy().subscribe({
      next: (data: any) => {
        this.allTaxo = data;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * CORE LOGIC: Gathers all variables and emits ONE object to the backend.
   * Matches your backend's destructured query parameters.
   */
  private emitConsolidatedFilters() {
    const filters: any = {};

    filters.query = this.searchQuery || '';
    if (this.minPrice !== null) filters.minPrice = this.minPrice.toString();
    if (this.maxPrice !== null) filters.maxPrice = this.maxPrice.toString();



    const subId = Number(this.selectedSubCategoryId);
    const catId = Number(this.selectedCategoryId);
    const typeId = Number(this.selectedTypeId);
    // Priority logic: Backend uses if/else if. 
    // We send only the most relevant ID to prevent empty results.
 if (subId > 0) {
    filters.subCategoryId = subId;
  } else if (catId > 0) {
    filters.categoryId = catId;
  } else if (typeId > 0) {
    filters.typeId = typeId;
  }

    console.log('Final Filter Object Sent to Backend:', filters);
    this.filterChanged.emit(filters);
  }

  // --- HTML Event Triggers ---

  onSearchChange(event: any) {
    this.searchQuery = event.target.value;
    this.filterStream.next();
  }

  onPriceChange() {
    this.filterStream.next();
  }

  OnselectType(id: number) {
    // Toggle logic: if clicking same one, deselect. Otherwise select and clear others.
    this.selectedTypeId = (this.selectedTypeId === id) ? null : id;
    this.selectedCategoryId = null;
    this.selectedSubCategoryId = null;
    this.filterStream.next();
  }

  OnselectCategory(id: number) {
    this.selectedCategoryId = (this.selectedCategoryId === id) ? null : id;
    // this.selectedTypeId = null;
    this.selectedSubCategoryId = null;
    this.filterStream.next();
  }

  OnselectSubCategory(id: number) {
    this.selectedSubCategoryId = (this.selectedSubCategoryId === id) ? null : id;
    // this.selectedTypeId = null;
    // this.selectedCategoryId = null;
    this.filterStream.next();
  }

  // UI Folder Management
  toggleCategories(id: number) {
    if (this.expandedCategories.has(id)) {
      this.expandedCategories.delete(id);
    } else {
      this.expandedCategories.add(id);
    }
  }

  isExpanded(id: number): boolean {
    return this.expandedCategories.has(id);
  }
}
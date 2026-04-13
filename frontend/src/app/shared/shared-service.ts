import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { product } from '../models/product-model';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private apiurl = "http://localhost:3005"
  private http = inject(HttpClient)

  private isShownSubject = new BehaviorSubject<any | null>(null);
  isShown$ = this.isShownSubject.asObservable();
  showmess = ''

  getSearchedProducts(page: number, limit: number, filters: any) {
    let params = new HttpParams()

      .set('page', page.toString())
      .set('limit', limit.toString())

    if (filters.subCategoryId) params = params.set('subCategoryId', filters.subCategoryId)
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId)
    if (filters.typeId) params = params.set('typeId', filters.typeId)

    if (filters.query) params = params.set('query', filters.query)
    if (filters.minPrice) {
      params = params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }
    console.log(filters);
    console.log('Sending Params:', params.toString()); // Debugging line

    return this.http.get<product[]>(`${this.apiurl}/prod/search`, { params: params })
  }

  showError(message2: string) {
    this.showmess = message2
    setTimeout(() => {
      this.isShownSubject.next(this.showmess);
    }, 100);
  }

  close() {
    this.isShownSubject.next(null); // This notifies the HTML to hide the modal
    console.log("Pop up closed successfully");
  }
}

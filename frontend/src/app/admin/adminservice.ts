import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type } from '../models/taxonomy-model';
import { product } from '../models/product-model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Adminservice {
    private apiurl = 'http://localhost:3005'

  constructor(private http:HttpClient){}

  addType(type:string){
    return this.http.post<type>(`${this.apiurl}/taxo/addType`,{type})
  }

  addCategory(cate:string){
    return this.http.post(`${this.apiurl}/taxo/addCategory`,cate)
  }

  addSubCategory(credential:any){
    return this.http.post(`${this.apiurl}/taxo/addSubCate`, credential)
  }

  getAllTypes(){
    return this.http.get(`${this.apiurl}/taxo/allTypes`)
  }

  gteAllCategories(){
    return this.http.get(`${this.apiurl}/taxo/allCategories`)
  }

  getAllSubCate(){
    return this.http.get(`${this.apiurl}/taxo/allSubCate`)
  }

  removeType(id:number){
    return this.http.delete(`${this.apiurl}/taxo/delete/${id}`)
  }

  addProduct(data:FormData){
    return this.http.post(`${this.apiurl}/prod/add`,data)
  }

  updateProduct(id:number, data:product){
    return this.http.patch(`${this.apiurl}/prod/update/${id}`,data)
  }

  getAllProducts(){
    return this.http.get(`${this.apiurl}/prod/allproducts`)
  }

  deleteProduct(id:number){
    return this.http.delete(`${this.apiurl}/prod/delete/${id}`)
  }

  getAllUser(){
    return this.http.get(`${this.apiurl}/admincon/allusers`)
  }

  lockUser(id:number){
    return this.http.put(`${this.apiurl}/admincon/lockUser/${id}`,{})
  }

  unlockUser(id:number){
    return this.http.put(`${this.apiurl}/admincon/unlockUser/${id}`,{})
  }

  getTaxonomy(){
    return this.http.get(`${this.apiurl}/prod/types`)
  }

  getAllOrders(){
    return this.http.get(`${this.apiurl}/order/allOrders`)
  }

}

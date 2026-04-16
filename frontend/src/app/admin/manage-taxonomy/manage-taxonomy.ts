import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Adminservice } from '../adminservice';
import { JsonPipe } from '@angular/common';
import { Category, SubCategory, type } from '../../models/taxonomy-model';
import { validate } from '@angular/forms/signals';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-manage-taxonomy',
  imports: [ReactiveFormsModule],
  templateUrl: './manage-taxonomy.html',
  styleUrl: './manage-taxonomy.css',
})
export class ManageTaxonomy implements OnInit {

  addtypeForm!:FormGroup
  addCtegoryForm!:FormGroup
  addSubCateForm!:FormGroup

  allTypes!:type[]
  allCate!:Category[]
  allSubCate!:SubCategory[]

  private fb = inject(FormBuilder)
  private admserv = inject(Adminservice)
  private cdr = inject(ChangeDetectorRef)

  constructor(){
    this.addtypeForm = this.fb.group({
      type: ['', [Validators.required, Validators.minLength(3)]]
    }),

    this.addCtegoryForm =this.fb.group({
      category:['', [Validators.required, Validators.minLength(3)]],
      typeId:['', [Validators.required]]
    }),
    this.addSubCateForm =this.fb.group({
      name:['', [Validators.required, Validators.minLength(3)]],
      categoryId:['', [Validators.required]]
    })
  }
  ngOnInit(): void {
    this.getAllType()
    this.getAllSubcate()
    this.getAllcategories()
  }

  addType(){
    console.log(this.addtypeForm.value);
    
    this.admserv.addType(this.addtypeForm.value).subscribe({
      next:(data)=>{
        console.log(data);
        window.location.reload()
      }
    })
  }

  addcategory(){
    this.admserv.addCategory(this.addCtegoryForm.value).subscribe({
      next:(data)=>{
        console.log(data);
          window.location.reload()
      },
    })
  }

  addSubCate(){
    this.admserv.addSubCategory(this.addSubCateForm.value).subscribe({
      next:(data)=>{
        console.log(data);
        window.location.reload()
      }
    })
  }

  getAllType(){
    this.admserv.getAllTypes().subscribe({
      next:(data:any)=>{
        this.cdr.detectChanges()
        this.allTypes=data.alltypes
        console.log(data); 
        this.cdr.detectChanges()
      }
    })
  }

  deleteType(id:number){
    this.admserv.removeType(id).subscribe({
      next:(data)=>{
        console.log(data)
        this.allTypes = this.allTypes.filter(type => type.id !== id);
      }
    })
  }

  getAllcategories(){
    this.admserv.gteAllCategories().subscribe({
      next:(data:any)=>{
        console.log(data, "all ctegories");
        this.allCate = data.alltypes
      }
    })
  }

   getAllSubcate(){
    this.admserv.getAllSubCate().subscribe({
      next:(data:any)=>{
        console.log(data);
        this.allSubCate = data.alltypes
      }
    })
  }
}

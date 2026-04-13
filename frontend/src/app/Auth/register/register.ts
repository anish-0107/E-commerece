import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { email, validate } from '@angular/forms/signals';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user-model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {


  private fb = inject(FormBuilder)
  private authserv = inject(AuthService)
  private router = inject(Router)

  registerForm!:FormGroup

  constructor(){
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
      passowrd: ['', [Validators.required, Validators.minLength(3)]],
    })
  }

  register(){
    this.authserv.register(this.registerForm.value).subscribe({
      next:(data:any)=>{
        console.log(data);
        this.router.navigate(['/auth/login'])

      }
    })
  }
}

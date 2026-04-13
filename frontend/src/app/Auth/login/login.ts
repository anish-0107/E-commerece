import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../auth-service';
import { email, validate } from '@angular/forms/signals';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm!: FormGroup
  resetForm!: FormGroup
  errorMesage: string = ''

  email: string = ''

  private authserv = inject(AuthService)
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private cdr = inject(ChangeDetectorRef)

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
      passowrd: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.resetForm = this.fb.group({
      email: ['', [Validators.required]],
      resetPassword: ['', [Validators.required]],
      code: ['', [Validators.required]]
    })
  }



  login() {

    if (this.loginForm.valid) {
      this.authserv.login(this.loginForm.value).subscribe({
        next: (data) => {
          console.log('Login successful:', data);
          if (data.role === 'admin') {
            this.router.navigate(['/admin/products'])
          }
          else if(data.role === "user") {
            this.router.navigate(['/user/main'])
          }
        },

        error: (err) => {
          this.errorMesage = err.error?.message || "invalid email or passowrd"
        }
      })
    }
  }

  logout() {
    this.authserv.logout().subscribe({
      next: (data) => {
        console.log('Logout successful:', data);
        this.router.createUrlTree(['/auth/login']);
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.error('Logout error:', err);
      }
    })
  }
  get f() {
    return this.loginForm.controls;
  }


}
import { httpResource } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../Auth/auth-service';
import { User } from '../../models/user-model';
import { CommonModule, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  ngOnInit(): void {
    this.getProfile()
  }

  private authserv = inject(AuthService)
  private router = inject(Router)

  currentUser!: User

  updateProfileForm!: FormGroup
  changePassForm!: FormGroup;

  updateForm:boolean = false
  changePass:boolean= false


  private fb = inject(FormBuilder)
  private cdr = inject(ChangeDetectorRef)

  constructor() {
    this.updateProfileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    }),
    this.changePassForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    })
  }


  getProfile() {
    return this.authserv.getProfile().subscribe({
      next: (data: any) => {
        this.currentUser = data.user
        console.log(data);
        this.cdr.detectChanges()
      }
    })
  }


  updateProfile() {
    return this.authserv.updateProfile(this.updateProfileForm.value).subscribe({
      next: (data) => {
        console.log(data);
        this.updateForm =true
      }
    })
  }

  closeModal(){
    this.updateForm =false
  }

  showUpdateForm(){
    this.updateForm=true
  }

  onChangePassword() {
    if (this.changePassForm.valid) {
      this.authserv.changePassword(this.currentUser.id, this.changePassForm.value).subscribe({
        next: (res) => {
          alert('Password changed successfully!');
          this.changePassForm.reset();
        },
        error: (err) => {
          alert(err.error.message || 'Error changing password');
        }
      });
    }
  }

  showPassForm(){
    this.changePass=true
  }
  closePassForm(){
    this.changePass=false
  }

  logout(){
    this.authserv.logout().subscribe({
      next:(data)=>{
        console.log(data);
        window.location.reload
      }
    })
  }

  
}

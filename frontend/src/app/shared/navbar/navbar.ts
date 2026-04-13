import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../Auth/auth-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  ngOnInit(): void {
    this.isLoggedIn()
  }

  public authServ = inject(AuthService)
  public cdr = inject(ChangeDetectorRef)
  private router = inject(Router)

  
  currentUserData!:any 
  isLoggedIn(){
    this.authServ.currentUser$.subscribe(data=>{
      this.currentUserData= data
      console.log(this.currentUserData);
      this.cdr.detectChanges()
    })
  }

  
  logout(){
    this.authServ.logout().subscribe({
      next:(data)=>{
        console.log(data);
        window.location.reload
        this.router.navigate(['/auth/login'])
      }
    })
  }


}

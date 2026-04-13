import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-forgot-pass',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-pass.html',
  styleUrl: './forgot-pass.css',
})
export class ForgotPass  {

  resetForm!:FormGroup
  codeSent:boolean=false
  resetCode!:number

  private fb = inject(FormBuilder)
  private authserv = inject(AuthService)
  private cdr = inject(ChangeDetectorRef)

  constructor(){
   this.resetForm = this.fb.group({
      email: ['', [Validators.required]],
      resetPassword:['',[Validators.required]],
      code:['',[Validators.required]]
    })
  }

    forgotPassowrd(email:string){
    this.authserv.forgotPassword(email).subscribe({
      next:(data)=>{
        console.log(data);
        this.resetCode=data.code
        this.codeSent=true
        console.log(this.resetCode,this.codeSent);
        this.cdr.detectChanges();
      }
    })
  }

  reserPassword(){
    if(this.resetForm.valid){
    this.authserv.resetPassword(this.resetForm.value).subscribe({
      next:(data)=>{
        console.log(data);
      }
    })
  }
  else{
    console.log("error occured");
  }
  }

  copyCode(code: string) {
  navigator.clipboard.writeText(code);
  // Optional: show a quick "Copied!" message or alert
  alert("Code copied to clipboard!"); 
}
private timerInterval: any;

ngOnDestroy() {
  if (this.timerInterval) {
    clearInterval(this.timerInterval); // Stop the clock when the user leaves
  }
}
}

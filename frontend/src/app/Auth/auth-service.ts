import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { data, User, userState } from '../models/user-model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  private http = inject(HttpClient)
  private apiurl = 'http://localhost:3005/auth'


  private authState$ = new BehaviorSubject<userState>({
    isLoggedIn:false,
    role:null
  })

  private currentUserSubject = new BehaviorSubject<User | null>(null)
  private isInitializiedSubject = new BehaviorSubject<boolean>(false)

  public isInitialized$ =this.isInitializiedSubject.asObservable() 

  public currentUser$ = this.currentUserSubject.asObservable()
  cookieService:any

  constructor(){
    this.checkSession()
  }

  private checkSession(){
    this.http.get<{user: User}>(`${this.apiurl}/me`).pipe(
      tap(response => {
        // console.log("success",response);
        this.currentUserSubject.next(response.user);
        // console.log(this.currentUserSubject.value);
      }),
      catchError((error) => {
        console.log(error,"err");
        
        this.currentUserSubject.next(null);
        return of(null);
      }),
      finalize(() => {
        this.isInitializiedSubject.next(true);
      })
    ).subscribe();
  }
  


  // get current state of an observable
  getAuthState():Observable<userState>{
    return this.authState$.asObservable()
  }

  getUserRole():'user'|'admin'| null{
    return this.authState$.getValue().role;
  }

  isAutheticated():boolean{
    return this.authState$.getValue().isLoggedIn
  }

  login(credential: data) {
    return this.http.post<User>(`${this.apiurl}/login`, credential,{withCredentials: true}).pipe(
      tap((user) => {
        // Update auth state after successful login
        this.authState$.next({ 
          isLoggedIn: true, 
          role: user.role as 'user' | 'admin' 
        });
      })
    )
  }

  logout() {
    return this.http.get<{}>(`${this.apiurl}/logout`).pipe(
      tap(() => {
        // Clear auth state after logout
        this.authState$.next({ 
          isLoggedIn: false, 
          role: null 
        });
        this.currentUserSubject.next(null)
      })
    )
  }

  register(credential: data) {
    return this.http.post<User>(`${this.apiurl}/register`, credential).pipe(
      tap((user) => {
        // Update auth state after successful registration
        this.authState$.next({ 
          isLoggedIn: true, 
          role: user.role as 'user' | 'admin' 
        });
      })
    )
  }

  getProfile(){
    return this.http.get<{}>(`${this.apiurl}/profile`)
  }

  forgotPassword(email:string){
  return this.http.post<{code:number}>(`${this.apiurl}/forgotPass`,{email:email},{withCredentials:true})
  }

  resetPassword(credential:any){
    return this.http.post<User>(`${this.apiurl}/resetPass`,credential,{withCredentials:true})
  }

  updateProfile(data:any){
    return this.http.patch(`${this.apiurl}/updateProfile`,data,{withCredentials:true})
  }

  changePassword(userId: number, passwordData: any): Observable<any> {
  return this.http.post(`${this.apiurl}/chnagePassword/${userId}`, passwordData);
}

}

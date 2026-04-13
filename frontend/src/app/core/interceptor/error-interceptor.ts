import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../../Auth/auth-service";
import { SharedService } from "../../shared/shared-service";


export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Inject services directly at the top of the function
  const router = inject(Router);
  const errorService = inject(SharedService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const backendResponse = err.error.error.message;
      console.log(err);
      

      if (err.status === 401 || err.status === 403 || err.status == 404) {
        // authService.logout();
        router.navigate(["auth/login"]);
      } 
      else if (err.status === 500) {
        console.log("Critical server error (500) detected.");
      }

      errorService.showError(backendResponse);

      return throwError(() => err);
    })
  );
};
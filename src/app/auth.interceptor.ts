import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(private afAuth: AngularFireAuth) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return this.afAuth.authState.pipe(
      switchMap(user => {
       
        if (user) {
        
          return from(user.getIdToken()).pipe(
            switchMap(token => {
             
              const authRequest = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              });
              
              return next.handle(authRequest);
            })
          );
        } else {
          
          return next.handle(request);
        }
      })
    );
  }
}
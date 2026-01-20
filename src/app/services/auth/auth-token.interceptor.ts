import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent
} from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { from, Observable, switchMap } from 'rxjs';



@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private auth: Auth) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    
    if (!req.url.startsWith('https://movierec-api-2026-bzhbarf8g8gmguej.japaneast-01.azurewebsites.net/')) {
      return next.handle(req);
    }

    return from(this.auth.authStateReady()).pipe(
      switchMap(() => from(this.auth.currentUser?.getIdToken() ?? Promise.resolve(null))),
      switchMap(token => {
        if (!token) return next.handle(req);

        return next.handle(
          req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          })
        );
      })
    );
  }
}

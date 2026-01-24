import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent
} from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { from, Observable, switchMap } from 'rxjs';
import { environment } from '../../../environmemts/environment';




@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private auth: Auth) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    if (!req.url.startsWith(environment.apiBaseUrl)) {
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

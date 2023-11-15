import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthTokenService} from "./auth-token.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private token :AuthTokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if  (this.token.authJwtToken){

      const cloned = request.clone({
        headers: request.headers.set("authorization" , this.token.authJwtToken)
      })
      return next.handle(cloned);
    }
    return next.handle(request);
  }
}

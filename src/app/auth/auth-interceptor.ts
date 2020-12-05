// Interceptor used to handle/intercept any outgoing http request
// A middlware for *outgoing* (not incoming) requests
// This interceptor will be used to attach a token to the request

import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    // Add header to outgoing request
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', "Bearer " + authToken!)
    });
    return next.handle(authRequest);
  }
}

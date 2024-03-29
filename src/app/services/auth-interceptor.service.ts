import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService){}
  intercept(req: HttpRequest<any>, next: HttpHandler){
    const authToken = this.authService.getToken() || "";
    const authRequest = req.clone({
      //headers: req.headers.set("Authorization", "Bearer " + authToken)
      params: req.params.append("token", authToken)
    });
    return next.handle(authRequest);
  }
}

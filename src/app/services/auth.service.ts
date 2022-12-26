import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Login } from '../models/login.model';
import { Register } from '../models/register.model';
import { RecoverPassword } from '../models/recover.model';
import { ChangePassword } from '../models/change.model';
import { AddUser } from '../models/adduser.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loginErrorMessage: Subject<string> = new Subject<string>();
  private registerErrorMessage: Subject<string> = new Subject<string>();
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private userName: string;
  private email: string;
  private program: string;
  dataUser: any;
  endpoint: String = environment.endpoint;
  idpay: string;

  constructor(private http: HttpClient, private router: Router) {
    this.loginErrorMessage.next('');
    this.registerErrorMessage.next('');
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getLoginErrorListener() {
    return this.loginErrorMessage.asObservable();
  }

  getRegisterErrorListener() {
    return this.registerErrorMessage.asObservable();
  }

  getUserName() {
    return this.userName;
  }

  getEmail() {
    return this.email;
  }

  getTestAvailable() {
    return this.http.get(this.endpoint + '/api/test/test-available');
  }

  getSurveyCompleted() {
    return this.http.get(this.endpoint + '/api/test/survey-completed');
  }

  getIsAdmin() {
    return this.http.post(this.endpoint + '/api/users/admin', {});
  }

  /* Funcion de auth de mercadolibre donde se valida si tiene pago o no*/
  meli(idPayment: string) {
    if (idPayment !== null) {
      return this.http.post<{ idPayment: string }>(
        this.endpoint +
          `/api/users/payments/ipn?topic=payment&id=${idPayment}&get_info=true`,
        null
      );
    }
  }

  /* Login Function */
  login(email: string, password: string, recaptcha: string) {
    const loginData: Login = {
      email: email,
      password: password,
      recaptcha: recaptcha,
    };
    //console.log(this.endpoint + "/api/users/login");

    //console.log("Sending request to: ", this.endpoint + "/api/users/login");
    this.http
      .post<{
        token: string;
        expiresIn: number;
        status: Number;
        name: string;
        email: string;
        programType: string;
      }>(this.endpoint + '/api/users/login', loginData)
      .subscribe(
        (loginResponse) => {
          const program = loginResponse;
          const token = loginResponse.token;
          this.token = token;
          if (token) {
            const expiresInDuration = loginResponse.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userName = loginResponse.name;
            this.email = loginResponse.email;
            this.program = loginResponse.programType;
            this.dataUser = loginResponse;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            //console.log(expirationDate);
            this.saveAuthData(
              token,
              expirationDate,
              this.userName,
              this.email,
              this.program,
              this.dataUser
            );
            if (this.email === 'octaedrodisenamosfuturo@gmail.com') {
              this.router.navigate(['/adminBase']);
            } else {
              this.router.navigate(['/dashboard']);
              this.loginErrorMessage.next('');
            }
          }
        },
        (err) => {
          this.loginErrorMessage.next(err.error.message);
        }
      );
  }

  /* Register Function */
  register(
    name: string,
    email: string,
    password: string,
    program_type: string,
    //license: string,
    recaptcha: string
  ) {
    const registerData: Register = {
      name: name,
      password: password,
      email: email,
      program_type: program_type,
      //license: license,
      recaptcha: recaptcha,
    };

    //console.log(registerData);
    //console.log(this.endpoint + "/api/users/signup");

    this.http
      .post<{
        message: string;
        status: Number;
        mercadopago_link: string;
        payment: boolean;
        login: boolean;
      }>(this.endpoint + '/api/users/signup', registerData)
      .subscribe(
        (data) => {
          if (data.login === true) {
            this.login(
              registerData.email,
              registerData.password,
              registerData.recaptcha
            );
          } else {
            if (data.payment == true) {
              window.location.href = data.mercadopago_link;
            } else {
              alert('disuclpa por el inceveniente intenta de nuevo!!!');
            }
          }
          // this.router.navigate([data.mercadopago_link]);
          // this.registerErrorMessage.next("");
        },
        (err) => {
          //console.log(err);
          this.authStatusListener.next(false);
          //console.log(err.error.message);
          this.registerErrorMessage.next(err.error.message);
        }
      );
  }

  addUser(
    name: string,
    password: string,
    email: string,
    program_type: string,
    disable_payment: number,
    recaptcha: string,
    is_admin: boolean
  ) {
    const addUserData: AddUser = {
      name: name,
      password: password,
      email: email,
      program_type: program_type,
      disable_payment: disable_payment,
      recaptcha: recaptcha,
      is_admin: is_admin,
    };
    console.log(addUserData, 'esta es la darta');
    //console.log(this.endpoint + "/api/users/allow");
    return this.http.post<{ message: string }>(
      this.endpoint + '/api/users/allow',
      addUserData
    );
  }

  recoverPassword(email: string, recaptcha: string) {
    const recoverData: RecoverPassword = {
      email: email,
      recaptcha: recaptcha,
    };
    return this.http.post<{ message: string }>(
      this.endpoint + '/api/users/forgot',
      recoverData
    );
  }

  changePassword(
    //oldPassword: string,
    password: string,
    recaptcha: string,
    token_reset: string
  ) {
    const changeData: ChangePassword = {
      //oldPassword: oldPassword,
      password: password,
      recaptcha: recaptcha,
    };
    if (token_reset != '') {
      //console.log(this.endpoint + "/api/users/change?token_reset=" + token_reset);
      return this.http.post<{ message: string }>(
        this.endpoint + '/api/users/change?token_reset=' + token_reset,
        changeData
      );
    } else {
      //console.log(this.endpoint + "/api/users/change");
      return this.http.post<{ message: string }>(
        this.endpoint + '/api/users/change',
        changeData
      );
    }
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userName = authInformation.userName;
      this.email = authInformation.email;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userName = null;
    this.email = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    //console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userName: string,
    email: string,
    program: string,
    dataUser: any
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userName', userName);
    localStorage.setItem('email', email);
    localStorage.setItem('programa', program);
    localStorage.setItem('userdata', JSON.stringify(dataUser.userInfo));
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('email');
    localStorage.removeItem('userName');
    localStorage.removeItem('programa');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userName = localStorage.getItem('userName');
    const email = localStorage.getItem('email');
    const program = localStorage.getItem('program');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userName: userName,
      email: email,
      program: program,
    };
  }
}

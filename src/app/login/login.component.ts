import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  recaptcha: string = '';
  @ViewChild('captchaElem') captchaElemn: any;
  recaptchaCode: String = environment.recaptchaCode;
  isLoading = false;
  private authStatusSub: Subscription;
  form: FormGroup;
  private errorMessageSub: Subscription;
  public errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (this.userIsAuthenticated) {
      this.router.navigate(['/dashboard']);
    }

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        //console.log(this.userIsAuthenticated);
        if (this.userIsAuthenticated) {
          this.router.navigate(['/dashboard']);
        }
      });

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.errorMessageSub = this.authService
      .getLoginErrorListener()
      .subscribe((error) => {
        //console.log("cambiar error");
        this.errorMessage = error;
        this.isLoading = false;
      });
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, { validators: [Validators.required] }),
      remember: new FormControl(null),
      recaptcha: new FormControl(null, { validators: [Validators.required] }),
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      const idPago = params['payment_id'];
      // console.log(`idpago:${idPago}`);
      this.authService.meli(idPago).subscribe((res) => {
      });;
    });

    /*this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has("error")){
         this.numError = paramMap.get("error");
         if(this.numError == "1"){
            this.wrongPassword = true;
         }else if(this.numError == "2"){
            this.serverError = true;
         }
      }
    })*/
  }

  resolved(captchaResponse: string) {
    this.recaptcha = captchaResponse;
    this.form.patchValue({ recaptcha: this.recaptcha });
    this.form.get('recaptcha').updateValueAndValidity();
  }

  onLogin() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(
      this.form.value.email,
      this.form.value.password,
      this.form.value.recaptcha
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.errorMessageSub.unsubscribe();
  }
}

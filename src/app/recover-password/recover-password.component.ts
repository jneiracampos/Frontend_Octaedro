import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from "../../environments/environment";
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  recaptcha: string = "";
  @ViewChild("captchaElem") captchaElemn: any;
  recaptchaCode: String = environment.recaptchaCode;

  form: FormGroup;
  isLoading = false;
  status: number = 0;
  success = false;
  error = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, {validators: [Validators.required, Validators.email]}), 
      recaptcha: new FormControl(null, {validators: [Validators.required]})
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    if(this.userIsAuthenticated){
      this.router.navigate(["/change_password"]);
    }

    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      //console.log(this.userIsAuthenticated);
      if(this.userIsAuthenticated){
        this.router.navigate(["/change_password"]);
      }
    })
  }

  resolved(captchaResponse: string){
    this.recaptcha = captchaResponse;
    this.form.patchValue({recaptcha: this.recaptcha});
    this.form.get("recaptcha").updateValueAndValidity();
  }

  onRecover(){
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    this.success = false;
    this.error = false;
    this.authService.recoverPassword(
      this.form.value.email, 
      this.form.value.recaptcha
    ).subscribe(
      (response) => {
        this.isLoading = false;
        this.success = true;
      }, (err) => {
        this.isLoading = false;
        this.error = true;
      }
    )

  }


}

import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from "../../environments/environment";
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  recaptcha: string = "";
  @ViewChild("captchaElem") captchaElemn: any;
  recaptchaCode: String = environment.recaptchaCode;

  form: FormGroup;
  isLoading = false;
  status: number = 0;
  message: string = "";
  success = false;
  error = false;
  token_reset: string = "";


  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params: Params) => {
      if (params["token_reset"] != null && params["token_reset"] != "") {
        this.token_reset = params["token_reset"];
      }else{
        //console.log("no token");
        this.userIsAuthenticated = this.authService.getIsAuth();
        if (!this.userIsAuthenticated) {
          this.router.navigate(["/recover"]);
        }

        this.authListenerSubs = this.authService
          .getAuthStatusListener()
          .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            if (!this.userIsAuthenticated) {
              this.router.navigate(["/recover"]);
            }
          })
      }
    });



    this.form = new FormGroup({
      //oldPassword: new FormControl(null, { validators: [Validators.required] }),
      newPassword: new FormControl(null, { validators: [Validators.required, Validators.minLength(8)] }),
      confirmPassword: new FormControl(null, { validators: [Validators.required, Validators.minLength(8)] }),
      recaptcha: new FormControl(null, { validators: [Validators.required] })
    }, { validators: this.checkPasswords });
  }

  resolved(captchaResponse: string) {
    this.recaptcha = captchaResponse;
    this.form.patchValue({ recaptcha: this.recaptcha });
    this.form.get("recaptcha").updateValueAndValidity();
  }

  onChangePassword() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.success = false;
    this.error = false;
    this.authService.changePassword(
      //this.form.value.oldPassword,
      this.form.value.newPassword,
      this.form.value.recaptcha, 
      this.token_reset
    ).subscribe(
      (response) => {
        this.isLoading = false;
        this.success = true;
      }, (err) => {
        this.isLoading = false;
        this.error = true;
        //console.log(err);
      }
    )
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const newPassword = group.get('newPassword').value;
    const confirmPassword = group.get('confirmPassword').value;
    return newPassword === confirmPassword ? null : { notSame: true }
  }


}

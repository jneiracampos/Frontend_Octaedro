import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from "../../environments/environment";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  programa = ["Pregrado", "Posgrado"];
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  private isAuthenticated = false;


  recaptcha: string = "";
  @ViewChild("captchaElem") captchaElemn: any;
  recaptchaCode: String = environment.recaptchaCode;

  isLoading = false;
  private authStatusSub: Subscription;
  form: FormGroup;
  private errorMessageSub: Subscription;
  public errorMessage: string = "";

  constructor(private authService: AuthService, private router: Router) { }


  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    if(this.userIsAuthenticated){
      this.router.navigate(["/dashboard"]);
    }

    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      if(this.userIsAuthenticated){
        this.router.navigate(["/dashboard"]);
      }
    })

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    )
    this.errorMessageSub = this.authService.getRegisterErrorListener().subscribe(
      (error) => {
        //console.log("Cambiar error");
        this.errorMessage = error;
        this.isLoading = false;
      }
    )

    this.form = new FormGroup({
      name: new FormControl(null, {validators: [Validators.required, Validators.minLength(10)]}), 
      emailInput: new FormControl(null, {validators: [Validators.required, Validators.email]}),
      password: new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]}), 
      confirmPassword: new FormControl(null, {validators: [Validators.required]}),
      programa:new FormControl(null, {validators: [Validators.required]}),
      //license: new FormControl(null, {validators: [Validators.required, Validators.minLength(64)]}),
      recaptcha: new FormControl(null, {validators: [Validators.required]}), 
      acceptConditions: new FormControl(null, {validators: [Validators.required]})

    }, {validators: this.checkPasswords});

    this.form.get("acceptConditions").valueChanges.subscribe(val => {
      if (val == "0") {
        this.form.patchValue({ "acceptConditions": null });
        this.form.updateValueAndValidity();
      }
    });
  }

  resolved(captchaResponse: string){
    this.recaptcha = captchaResponse;
    this.form.patchValue({recaptcha: this.recaptcha});
    this.form.get("recaptcha").updateValueAndValidity();
  }

  onRegister(){
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.register(
      this.form.value.name, 
      this.form.value.emailInput,
      this.form.value.password,
      this.form.value.programa === '1' ?'Pregrado':'Posgrado' , 
      //this.form.value.license,
      this.form.value.recaptcha      
    )
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
    this.errorMessageSub.unsubscribe();
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;
    return password === confirmPassword ? null : { notSame: true }     
  }




}

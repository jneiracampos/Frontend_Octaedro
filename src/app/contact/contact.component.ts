import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from "../../environments/environment";
import { SendEmailService } from '../services/send-email.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  form: FormGroup;
  isLoading: boolean = false;
  success = false;
  error = false;
  recaptcha: string = "";
  @ViewChild("captchaElem") captchaElemn: any;
  recaptchaCode: String = environment.recaptchaCode;

  constructor(public emailService: SendEmailService) {
    this.form = new FormGroup({
      name: new FormControl(null, {validators: [Validators.required]}),
      email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
      subject: new FormControl(null, {validators: [Validators.required]}),
      message: new FormControl(null, {validators: [Validators.required]}), 
      recaptcha: new FormControl(null, {validators: [Validators.required]})
    });
  }

  ngOnInit(): void {
    
  }

  resolved(captchaResponse: string){
    this.recaptcha = captchaResponse;
    this.form.patchValue({recaptcha: this.recaptcha});
    this.form.get("recaptcha").updateValueAndValidity();
  }

  sendEmail(){
    this.isLoading = true;
    this.success = false;
    this.error = false;
    this.emailService.sendEmail(
      this.form.value.name, 
      this.form.value.email, 
      this.form.value.subject, 
      this.form.value.message, 
      this.form.value.recaptcha
    ).subscribe((response) => {
      this.isLoading = false;
      this.success = true;
    },
    (err) => {
      this.isLoading = false;
      this.error = true;
      //console.log("Error:", err);
    })
  }
}

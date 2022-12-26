import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  error = false;
  success = false;
  isLoading = false;
  loadResult = false;
  form: FormGroup;
  isAdmin: boolean;
  programa = ["Pregrado", "Posgrado"];
  pagos = ["Paga", "No paga"];
  password:'12345'
  recaptcha:'asda'
  programaType:string

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authService.getIsAdmin().subscribe((res) => {
      this.isAdmin = res["results"]["is_admin"] == 1 ? true: false;
      if(!this.userIsAuthenticated){
        console.log("no autentificado")
        this.router.navigate(["/"]);
      }else{
        if(!this.isAdmin){
          console.log("no admin")
          this.router.navigate(["/"]);
        }
      }
    });

    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      if(!this.userIsAuthenticated){
        this.router.navigate(["/"]);
      }else{
        if(!this.isAdmin){
          this.router.navigate(["/"]);
        }
      }
    })

    
    
    this.form = new FormGroup({
      name: new FormControl(null, {validators: [Validators.required]}),
      email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
      programa:new FormControl(null, {validators: [Validators.required]}),
      pago:new FormControl(null, {validators: [Validators.required]}),
      admin: new FormControl(null),
    });
  }

  onAddUser(){
     if(this.form.invalid){
       return;
     }
     this.isLoading = true;
     this.success = false;
     this.error = false;

     let adminValue = false;
     if(this.form.value.admin){ adminValue = true; } 
     this.authService.addUser(
       this.form.value.name, 
       '123456',
       this.form.value.email,
       this.form.value.programa === '1' ?'Pregrado':'Posgrado' ,
       this.form.value.pago === '2' ?1:0 ,  
       'test',
       adminValue
     )
     .subscribe((response) => {
        this.isLoading = false;
        this.success = true;
     },(err) => {
        this.isLoading = false;
        //console.log(err.error.message);
        this.error = true;
     })
  }

}

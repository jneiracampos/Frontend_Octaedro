import { Component, OnInit } from '@angular/core';
import { AnimationItem } from "lottie-web";
import { AnimationOptions } from "ngx-lottie";
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  optionsDashboard: AnimationOptions = {
    path: "../assets/animations/dashboard.json"
  }

  optionsWomen: AnimationOptions = {
    path: "../assets/animations/women.json"
  }

  optionsLogo2: AnimationOptions = {
    path: "../assets/animations/logo2.json"
  }

  optionsAviones: AnimationOptions = {
    path: "../assets/animations/aviones.json"
  }


  /*animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }*/
  optionsCheck: AnimationOptions = {
    path: "../assets/animations/checklist.json"
  }

  optionsTerapia: AnimationOptions = {
    path: "../assets/animations/terapia.json"
  }

  optionsMariposa: AnimationOptions = {
    path: "../assets/animations/mariposa.json"
  }

  optionsSer: AnimationOptions = {
    path: "../assets/animations/ser.json"
  }

  optionsConversacion: AnimationOptions = {
    path: "../assets/animations/conversacion.json"
  }

  optionsExpositor: AnimationOptions = {
    path: "../assets/animations/expositor.json"
  }

  optionsRobot: AnimationOptions = {
    path: "../assets/animations/robot.json"
  }

  showCookies = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    /* Verificar que el usuario esté logeado */
    this.userIsAuthenticated = this.authService.getIsAuth();
    if(this.userIsAuthenticated){
      this.router.navigate(["/dashboard"]);
    }

    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      //console.log(this.userIsAuthenticated);
      if(this.userIsAuthenticated){
        this.router.navigate(["/dashboard"]);
      }
    })

  }

  getCookies(){
    return localStorage.getItem("cookies");
  }

  acceptCookies(){
    localStorage.setItem("cookies", "1");
  }

}

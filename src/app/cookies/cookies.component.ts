import { Component, OnInit } from '@angular/core';
import { AnimationItem } from "lottie-web";
import { AnimationOptions } from "ngx-lottie";

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.css']
})
export class CookiesComponent implements OnInit {


  optionsLogo2: AnimationOptions = {
    path: "../assets/animations/logo2.json"
  }

  constructor() { }

  ngOnInit(): void {
  }

}

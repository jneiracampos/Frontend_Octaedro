import { Component, OnInit } from '@angular/core';
import { AnimationItem } from "lottie-web";
import { AnimationOptions } from "ngx-lottie";


@Component({
  selector: 'app-politicas',
  templateUrl: './politicas.component.html',
  styleUrls: ['./politicas.component.css']
})
export class PoliticasComponent implements OnInit {

  optionsLogo2: AnimationOptions = {
    path: "../assets/animations/logo2.json"
  }

  constructor() { }

  ngOnInit(): void {
  }

}

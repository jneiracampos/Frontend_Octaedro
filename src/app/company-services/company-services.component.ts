import { Component, OnInit } from '@angular/core';
import { AnimationItem } from "lottie-web";
import { AnimationOptions } from "ngx-lottie";

@Component({
  selector: 'app-company-services',
  templateUrl: './company-services.component.html',
  styleUrls: ['./company-services.component.css']
})
export class CompanyServicesComponent implements OnInit {

  constructor() { }

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


  ngOnInit(): void {
  }

}

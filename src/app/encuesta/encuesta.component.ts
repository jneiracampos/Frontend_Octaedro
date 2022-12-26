import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {

  constructor(private testService: TestService, private router: Router, private authService: AuthService) { }

  surveyCompleted: string;
  userIsAuthenticated = false;
  form0: FormGroup;
  isLoading: boolean = false;
  surveyError: boolean = false;
  
  // Mapas.
  generoMap = {
    "1": "Femenino", 
    "2": "Masculino", 
    "3": "Otro"
  }

  rangoEdadMap = {
    "1": "13-16", 
    "2": "17-19", 
    "3": "20-22",
    "4": "23-25", 
    "5": "Más de 25"
  }

  preferenciaEstudiosMap = {
    "1": "Tecnólogo", 
    "2": "Técnico", 
    "3": "Universitario",
    "4": "Posgrados", 
  }

  ngOnInit(): void {

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authService.getSurveyCompleted().subscribe((res) => {
      this.surveyCompleted = res["survey_completed"] == 1? "1": "0"
    })

    if(this.userIsAuthenticated){
      if(this.surveyCompleted == '1'){
         this.router.navigate(["/dashboard"]);
      }
    }else{
      this.router.navigate(["/login"])
    }

    // Parte 0. Encuesta.
    this.form0 = new FormGroup({
      nombreInstitucion: new FormControl(null, {validators: [Validators.required]}),
      estratoSocioeconomico: new FormControl(null, {validators: [Validators.required]}),
      genero: new FormControl(null, {validators: [Validators.required]}),
      rangoEdades: new FormControl(null, {validators: [Validators.required]}),
      preferenciaEstudiosSuperiores: new FormControl(null, {validators: [Validators.required]}),
      asignaturaFilosofiaYLiteratura: new FormControl(0),
      asignaturaMatematicas: new FormControl(0),
      asignaturaSocialesYCiudadanas: new FormControl(0),
      asignaturaCienciasNaturales: new FormControl(0),
      asignaturaIdiomas: new FormControl(0),
      asignaturaDeportes: new FormControl(0),
      asignaturaArtesYDanza: new FormControl(0),
    });
  }

  // Parte 0. Encuesta.
  continuePart0(){
    let values = this.form0.value;
    this.isLoading = true;
    this.surveyError = false;
    this.testService.sendSurvey(
       values.nombreInstitucion,
       values.estratoSocioeconomico, 
       this.generoMap[values.genero], 
       this.rangoEdadMap[values.rangoEdades], 
       this.preferenciaEstudiosMap[values.preferenciaEstudiosSuperiores], 
       values.asignaturaFilosofiaYLiteratura, 
       values.asignaturaMatematicas, 
       values.asignaturaSocialesYCiudadanas,
       values.asignaturaCienciasNaturales,
       values.asignaturaIdiomas, 
       values.asignaturaDeportes, 
       values.asignaturaArtesYDanza
    ).subscribe(
      (response) => {
        this.isLoading = false;
        this.router.navigate(["/dashboard"]);
      }, (err) => {
        this.isLoading = false;
        this.surveyError = true;
    });

  }


}

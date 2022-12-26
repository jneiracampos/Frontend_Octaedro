import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AnimationItem } from "lottie-web";
import { AnimationOptions } from "ngx-lottie";
import { TestService } from "../services/test.service";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private testService: TestService, private router: Router, private authService: AuthService) { }
  userIsAuthenticated = false;
  testAvailable: string;
  surveyCompleted: string;
  private authListenerSubs: Subscription;
  isLoading = false;

  optionsGeometria: AnimationOptions = {
    path: "../assets/animations/geometria.json"
  }

  optionsIdea: AnimationOptions = {
    path: "../assets/animations/idea.json"
  }

  optionsConversacion: AnimationOptions = {
    path: "../assets/animations/conversacion.json"
  }

  optionsWomen: AnimationOptions = {
    path: "../assets/animations/women.json"
  }

  optionsJustice: AnimationOptions = {
    path: "../assets/animations/justicia.json"
  }

  progress: number = -1;
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

  // GENERAL.

  // PARTE A.
  parteA_real = 0;
  parteA_investigador = 0;
  parteA_social = 0;
  parteA_emprendedor = 0;
  parteA_artista = 0;
  parteA_convencional = 0;
  parteA_arr = [];

  // PARTE B.
  parteB_real = 0;
  parteB_investigador = 0;
  parteB_social = 0;
  parteB_emprendedor = 0;
  parteB_artista = 0;
  parteB_convencional = 0;
  parteB_arr = [];

  // PARTE C.
  parteC_real = 0;
  parteC_investigador = 0;
  parteC_social = 0;
  parteC_emprendedor = 0;
  parteC_artista = 0;
  parteC_convencional = 0;
  parteC_arr = [];

  // PARTE D.
  parteD_real = 0;
  parteD_investigador = 0;
  parteD_social = 0;
  parteD_emprendedor = 0;
  parteD_artista = 0;
  parteD_convencional = 0;
  parteD_arr = [];

  // CUADRO RESUMEN 1.
  resumen_real = 0;
  resumen_investigador = 0;
  resumen_social = 0;
  resumen_emprendedor = 0;
  resumen_artista = 0;
  resumen_convencional = 0;
  
  // PARTE ACTIVIDADES.
  parteActividades_real = 0;
  parteActividades_investigador = 0;
  parteActividades_social = 0;
  parteActividades_emprendedor = 0;
  parteActividades_artista = 0;
  parteActividades_convencional = 0;
  parteActividades_arr = [];

  // PARTE HABILIDADES.
  parteHabilidades_real = 0;
  parteHabilidades_investigador = 0;
  parteHabilidades_social = 0;
  parteHabilidades_emprendedor = 0;
  parteHabilidades_artista = 0;
  parteHabilidades_convencional = 0;
  parteHabilidades_arr = [];

  // PARTE OCUPACIONES
  parteOcupaciones_real = 0;
  parteOcupaciones_investigador = 0;
  parteOcupaciones_social = 0;
  parteOcupaciones_emprendedor = 0;
  parteOcupaciones_artista = 0;
  parteOcupaciones_convencional = 0;
  parteOcupaciones_arr = [];

  // Autoevaluacion 1 y 2.
  auto1_arr = [];
  auto2_arr = [];

  // PONDERACIÓN.
  arr_real = [];
  arr_investigador = [];
  arr_social = [];
  arr_emprendedor = [];
  arr_artista = [];
  arr_convencional = [];

  // RESULTADO FINAL.
  resultado_realista = 0;
  resultado_investigador = 0;
  resultado_social = 0;
  resultado_emprendedor = 0;
  resultado_artista = 0;
  resultado_convencional = 0; 

  // Total.
  total_arr = [];
  
  // Formularios.
  form0: FormGroup;
  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  form4: FormGroup;
  form5: FormGroup;
  form6: FormGroup;
  form7: FormGroup;
  form8: FormGroup;
  form9: FormGroup;

  ngOnInit(): void {

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authService.getTestAvailable().subscribe((res) => {
      this.testAvailable = res["test_available"] == 1 ? "1": "0";
    });
    this.authService.getSurveyCompleted().subscribe((res) => {
      this.surveyCompleted = res["survey_completed"] == 1? "1": "0"
    })
    
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    })

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

    // Parte 1. Autoconocimiento Parte A.
    this.form1 = new FormGroup({
      n1: new FormControl(null),
      n2: new FormControl(null),
      n3: new FormControl(null),
      n4: new FormControl(null),
      n5: new FormControl(null),
      n6: new FormControl(null),
      n7: new FormControl(null),
      n8: new FormControl(null),
      n9: new FormControl(null),
      n10: new FormControl(null),
      n11: new FormControl(null),
      n12: new FormControl(null),
      n13: new FormControl(null),
      n14: new FormControl(null),
      n15: new FormControl(null),

      n16: new FormControl(null),
      n17: new FormControl(null),
      n18: new FormControl(null),
      n19: new FormControl(null),
      n20: new FormControl(null),
      n21: new FormControl(null),
      n22: new FormControl(null),
      n23: new FormControl(null),
      n24: new FormControl(null),
      n25: new FormControl(null),
      n26: new FormControl(null),
      n27: new FormControl(null),
      n28: new FormControl(null),
      n29: new FormControl(null),
      n30: new FormControl(null),

      n31: new FormControl(null),
      n32: new FormControl(null),
      n33: new FormControl(null),
      n34: new FormControl(null),
      n35: new FormControl(null),
      n36: new FormControl(null),
      n37: new FormControl(null),
      n38: new FormControl(null),
      n39: new FormControl(null),
      n40: new FormControl(null),
      n41: new FormControl(null),
      n42: new FormControl(null),
      n43: new FormControl(null),
      n44: new FormControl(null),
      n45: new FormControl(null)

    })

    // Parte 2. Autoconoimiento Parte B.
    this.form2 = new FormGroup({
      n1: new FormControl(null, {validators: [Validators.required]}),
      n2: new FormControl(null, {validators: [Validators.required]}),
      n3: new FormControl(null, {validators: [Validators.required]}),
      n4: new FormControl(null, {validators: [Validators.required]}),
      n5: new FormControl(null, {validators: [Validators.required]}),
      n6: new FormControl(null, {validators: [Validators.required]}),
      n7: new FormControl(null, {validators: [Validators.required]}),
      n8: new FormControl(null, {validators: [Validators.required]}),
      n9: new FormControl(null, {validators: [Validators.required]}),
      n10: new FormControl(null, {validators: [Validators.required]}),
      n11: new FormControl(null, {validators: [Validators.required]}),
      n12: new FormControl(null, {validators: [Validators.required]}),
      n13: new FormControl(null, {validators: [Validators.required]}),
      n14: new FormControl(null, {validators: [Validators.required]}),
      n15: new FormControl(null, {validators: [Validators.required]}),
      n16: new FormControl(null, {validators: [Validators.required]}),
      n17: new FormControl(null, {validators: [Validators.required]}),
      n18: new FormControl(null, {validators: [Validators.required]})
    })

    // Parte 3. Autoconoimiento Parte C.
    this.form3 = new FormGroup({
      n1: new FormControl(null, {validators: [Validators.required]}),
      n2: new FormControl(null, {validators: [Validators.required]}),
      n3: new FormControl(null, {validators: [Validators.required]}),
      n4: new FormControl(null, {validators: [Validators.required]}),
      n5: new FormControl(null, {validators: [Validators.required]}),
      n6: new FormControl(null, {validators: [Validators.required]}),
      n7: new FormControl(null, {validators: [Validators.required]}),
      n8: new FormControl(null, {validators: [Validators.required]}),
      n9: new FormControl(null, {validators: [Validators.required]}),
      n10: new FormControl(null, {validators: [Validators.required]}),
      n11: new FormControl(null, {validators: [Validators.required]}),
      n12: new FormControl(null, {validators: [Validators.required]}),
      n13: new FormControl(null, {validators: [Validators.required]}),
      n14: new FormControl(null, {validators: [Validators.required]}),
      n15: new FormControl(null, {validators: [Validators.required]}),
      n16: new FormControl(null, {validators: [Validators.required]}),
      n17: new FormControl(null, {validators: [Validators.required]}),
      n18: new FormControl(null, {validators: [Validators.required]})
    })

    // Parte 4. Autoconoimiento Parte D.
    this.form4 = new FormGroup({
      n1: new FormControl(null, {validators: [Validators.required]}),
      n2: new FormControl(null, {validators: [Validators.required]}),
      n3: new FormControl(null, {validators: [Validators.required]}),
      n4: new FormControl(null, {validators: [Validators.required]}),
      n5: new FormControl(null, {validators: [Validators.required]})
    })

    // Parte 5. Actividades.
    this.form5 = new FormGroup({

      // Realista
      real1: new FormControl(null),
      real2: new FormControl(null),
      real3: new FormControl(null),
      real4: new FormControl(null),
      real5: new FormControl(null),
      real6: new FormControl(null),
      real7: new FormControl(null),
      real8: new FormControl(null),
      real9: new FormControl(null),
      real10: new FormControl(null),
      real11: new FormControl(null),

      // Social
      social1: new FormControl(null),
      social2: new FormControl(null),
      social3: new FormControl(null),
      social4: new FormControl(null),
      social5: new FormControl(null),
      social6: new FormControl(null),
      social7: new FormControl(null),
      social8: new FormControl(null),
      social9: new FormControl(null),
      social10: new FormControl(null),
      social11: new FormControl(null),
      
      // Investigador
      investigador1: new FormControl(null),
      investigador2: new FormControl(null),
      investigador3: new FormControl(null),
      investigador4: new FormControl(null),
      investigador5: new FormControl(null),
      investigador6: new FormControl(null),
      investigador7: new FormControl(null),
      investigador8: new FormControl(null),
      investigador9: new FormControl(null),
      investigador10: new FormControl(null),
      investigador11: new FormControl(null),
      
      // Emprendedor
      emprendedor1: new FormControl(null),
      emprendedor2: new FormControl(null),
      emprendedor3: new FormControl(null),
      emprendedor4: new FormControl(null),
      emprendedor5: new FormControl(null),
      emprendedor6: new FormControl(null),
      emprendedor7: new FormControl(null),
      emprendedor8: new FormControl(null),
      emprendedor9: new FormControl(null),
      emprendedor10: new FormControl(null),
      emprendedor11: new FormControl(null),

      // Artista
      artista1: new FormControl(null),
      artista2: new FormControl(null),
      artista3: new FormControl(null),
      artista4: new FormControl(null),
      artista5: new FormControl(null),
      artista6: new FormControl(null),
      artista7: new FormControl(null),
      artista8: new FormControl(null),
      artista9: new FormControl(null),
      artista10: new FormControl(null),
      artista11: new FormControl(null),

      // Convencional
      convencional1: new FormControl(null),
      convencional2: new FormControl(null),
      convencional3: new FormControl(null),
      convencional4: new FormControl(null),
      convencional5: new FormControl(null),
      convencional6: new FormControl(null),
      convencional7: new FormControl(null),
      convencional8: new FormControl(null),
      convencional9: new FormControl(null),
      convencional10: new FormControl(null),
      convencional11: new FormControl(null),
    });

    // Parte 6. Habilidades.
    this.form6 = new FormGroup({

      // Realista
      real1: new FormControl(null),
      real2: new FormControl(null),
      real3: new FormControl(null),
      real4: new FormControl(null),
      real5: new FormControl(null),
      real6: new FormControl(null),
      real7: new FormControl(null),
      real8: new FormControl(null),
      real9: new FormControl(null),
      real10: new FormControl(null),
      real11: new FormControl(null),

      // Social
      social1: new FormControl(null),
      social2: new FormControl(null),
      social3: new FormControl(null),
      social4: new FormControl(null),
      social5: new FormControl(null),
      social6: new FormControl(null),
      social7: new FormControl(null),
      social8: new FormControl(null),
      social9: new FormControl(null),
      social10: new FormControl(null),
      social11: new FormControl(null),
      
      // Investigador
      investigador1: new FormControl(null),
      investigador2: new FormControl(null),
      investigador3: new FormControl(null),
      investigador4: new FormControl(null),
      investigador5: new FormControl(null),
      investigador6: new FormControl(null),
      investigador7: new FormControl(null),
      investigador8: new FormControl(null),
      investigador9: new FormControl(null),
      investigador10: new FormControl(null),
      investigador11: new FormControl(null),
      
      // Emprendedor
      emprendedor1: new FormControl(null),
      emprendedor2: new FormControl(null),
      emprendedor3: new FormControl(null),
      emprendedor4: new FormControl(null),
      emprendedor5: new FormControl(null),
      emprendedor6: new FormControl(null),
      emprendedor7: new FormControl(null),
      emprendedor8: new FormControl(null),
      emprendedor9: new FormControl(null),
      emprendedor10: new FormControl(null),
      emprendedor11: new FormControl(null),

      // Artista
      artista1: new FormControl(null),
      artista2: new FormControl(null),
      artista3: new FormControl(null),
      artista4: new FormControl(null),
      artista5: new FormControl(null),
      artista6: new FormControl(null),
      artista7: new FormControl(null),
      artista8: new FormControl(null),
      artista9: new FormControl(null),
      artista10: new FormControl(null),
      artista11: new FormControl(null),

      // Convencional
      convencional1: new FormControl(null),
      convencional2: new FormControl(null),
      convencional3: new FormControl(null),
      convencional4: new FormControl(null),
      convencional5: new FormControl(null),
      convencional6: new FormControl(null),
      convencional7: new FormControl(null),
      convencional8: new FormControl(null),
      convencional9: new FormControl(null),
      convencional10: new FormControl(null),
      convencional11: new FormControl(null),
    });

    // Parte 7. Ocupaciones
    this.form7 = new FormGroup({

      // Realista
      real1: new FormControl(null),
      real2: new FormControl(null),
      real3: new FormControl(null),
      real4: new FormControl(null),
      real5: new FormControl(null),
      real6: new FormControl(null),
      real7: new FormControl(null),
      real8: new FormControl(null),
      real9: new FormControl(null),
      real10: new FormControl(null),
      real11: new FormControl(null),
      real12: new FormControl(null),
      real13: new FormControl(null),

      // Social
      social1: new FormControl(null),
      social2: new FormControl(null),
      social3: new FormControl(null),
      social4: new FormControl(null),
      social5: new FormControl(null),
      social6: new FormControl(null),
      social7: new FormControl(null),
      social8: new FormControl(null),
      social9: new FormControl(null),
      social10: new FormControl(null),
      social11: new FormControl(null),
      social12: new FormControl(null),
      social13: new FormControl(null),
      
      // Investigador
      investigador1: new FormControl(null),
      investigador2: new FormControl(null),
      investigador3: new FormControl(null),
      investigador4: new FormControl(null),
      investigador5: new FormControl(null),
      investigador6: new FormControl(null),
      investigador7: new FormControl(null),
      investigador8: new FormControl(null),
      investigador9: new FormControl(null),
      investigador10: new FormControl(null),
      investigador11: new FormControl(null),
      investigador12: new FormControl(null),
      
      // Emprendedor
      emprendedor1: new FormControl(null),
      emprendedor2: new FormControl(null),
      emprendedor3: new FormControl(null),
      emprendedor4: new FormControl(null),
      emprendedor5: new FormControl(null),
      emprendedor6: new FormControl(null),
      emprendedor7: new FormControl(null),
      emprendedor8: new FormControl(null),
      emprendedor9: new FormControl(null),
      emprendedor10: new FormControl(null),
      emprendedor11: new FormControl(null),
      emprendedor12: new FormControl(null),
      emprendedor13: new FormControl(null),


      // Artista
      artista1: new FormControl(null),
      artista2: new FormControl(null),
      artista3: new FormControl(null),
      artista4: new FormControl(null),
      artista5: new FormControl(null),
      artista6: new FormControl(null),
      artista7: new FormControl(null),
      artista8: new FormControl(null),
      artista9: new FormControl(null),
      artista10: new FormControl(null),
      artista11: new FormControl(null),
      artista12: new FormControl(null),
      artista13: new FormControl(null),

      // Convencional
      convencional1: new FormControl(null),
      convencional2: new FormControl(null),
      convencional3: new FormControl(null),
      convencional4: new FormControl(null),
      convencional5: new FormControl(null),
      convencional6: new FormControl(null),
      convencional7: new FormControl(null),
      convencional8: new FormControl(null),
      convencional9: new FormControl(null),
      convencional10: new FormControl(null),
      convencional11: new FormControl(null),
      convencional12: new FormControl(null),
      convencional13: new FormControl(null)
    });

    // Parte 8. Autoevaluación
    this.form8 = new FormGroup({

      // Realista
      real1: new FormControl(null, {validators: [Validators.required]}),
      real2: new FormControl(null, {validators: [Validators.required]}),

      // Social
      social1: new FormControl(null, {validators: [Validators.required]}),
      social2: new FormControl(null, {validators: [Validators.required]}),

      // Investigador
      investigador1: new FormControl(null, {validators: [Validators.required]}),
      investigador2: new FormControl(null, {validators: [Validators.required]}),

      
      // Emprendedor
      emprendedor1: new FormControl(null, {validators: [Validators.required]}),
      emprendedor2: new FormControl(null, {validators: [Validators.required]}),


      // Artista
      artista1: new FormControl(null, {validators: [Validators.required]}),
      artista2: new FormControl(null, {validators: [Validators.required]}),


      // Convencional
      convencional1: new FormControl(null, {validators: [Validators.required]}),
      convencional2: new FormControl(null, {validators: [Validators.required]}),

    });

    this.form9 = new FormGroup({});

    //console.log(this.form2.value);
  }

  

  N(value: any){
    if(value){ return 1;
    }else{ return 0; }
  }

  mapParte2(letter: string, numero: number){
    if((numero == 1 || numero == 16) && (letter == "2" || letter == "1")){
       return 1;
    }else if(numero != 1 && numero != 16){
      if(letter == "3"){ return 1; }
      else{ return 0; }
    }else{
      return 0;
    }
  }

  mapParte3(letter: string, numero: number){
    if((numero == 12) && (letter == "2" || letter == "1")){
       return 1;
    }else if(numero != 12){
      if(letter == "3"){ return 1; }
      else{ return 0; }
    }else{
      return 0;
    }
  }

  // Init test.
  continueIni(){
    if(this.userIsAuthenticated){
      if(this.testAvailable == '0'){
        this.router.navigate(["/dashboard"]);
      }
    }
    if(this.surveyCompleted != "1"){
      this.progress += 1;
    }else{
      this.progress += 2;
    }
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
        this.progress += 1;
      }, (err) => {
        this.isLoading = false;
        this.surveyError = true;
        console.log(err);
    });

  }

  // Parte 1. Autoconoimiento Parte A.
  continuePart1(){
    let values = this.form1.value;
    this.parteA_real = (this.N(values.n3) + this.N(values.n11) + this.N(values.n18) + this.N(values.n21) + this.N(values.n24) + this.N(values.n27) + this.N(values.n35) + this.N(values.n44));
    this.parteA_investigador = (this.N(values.n8) + this.N(values.n19) + this.N(values.n29) + this.N(values.n31) + this.N(values.n33) + this.N(values.n36) + this.N(values.n37) + this.N(values.n43));
    this.parteA_social = (this.N(values.n4) + this.N(values.n14) + this.N(values.n15) + this.N(values.n16) + this.N(values.n17) + this.N(values.n22));
    this.parteA_convencional = (this.N(values.n5) + this.N(values.n6) + this.N(values.n7) + this.N(values.n9) + this.N(values.n10) + this.N(values.n26) + this.N(values.n28) + this.N(values.n42));
    this.parteA_emprendedor = (this.N(values.n2) + this.N(values.n12) + this.N(values.n23) + this.N(values.n32) + this.N(values.n38) + this.N(values.n39) + this.N(values.n40) + this.N(values.n41));
    this.parteA_artista = (this.N(values.n1) + this.N(values.n13) + this.N(values.n20) + this.N(values.n25) + this.N(values.n30) + this.N(values.n34) + this.N(values.n45));
    this.parteA_arr = [
        this.parteA_real, 
        this.parteA_investigador,
        this.parteA_social, 
        this.parteA_convencional, 
        this.parteA_emprendedor, 
        this.parteA_artista
    ];
    //console.log(this.parteA_arr);
    this.progress += 1;
  }

  // Parte 2. Autoconoimiento Parte B.
  continuePart2(){
    let values = this.form2.value;
    //console.log(this.form2.value);
    this.parteB_real = (this.mapParte2(values.n1, 1) + this.mapParte2(values.n10, 10) + this.mapParte2(values.n16, 16));
    this.parteB_investigador = (this.mapParte2(values.n9, 9) + this.mapParte2(values.n13, 13) + this.mapParte2(values.n14, 14));
    this.parteB_social = (this.mapParte2(values.n5, 5) + this.mapParte2(values.n8, 8) + this.mapParte2(values.n17, 17));
    this.parteB_convencional = (this.mapParte2(values.n3, 3) + this.mapParte2(values.n4, 4) + this.mapParte2(values.n18, 18));
    this.parteB_emprendedor = (this.mapParte2(values.n7, 7) + this.mapParte2(values.n12, 12) + this.mapParte2(values.n15, 15));
    this.parteB_artista = (this.mapParte2(values.n2, 2) + this.mapParte2(values.n6, 6) + this.mapParte2(values.n11, 11));
    this.parteB_arr = [
        this.parteB_real, 
        this.parteB_investigador,
        this.parteB_social, 
        this.parteB_convencional, 
        this.parteB_emprendedor, 
        this.parteB_artista
    ];
    //console.log(this.parteB_arr);
    this.progress += 1;
  }

  // Parte 3. Autoconoimiento Parte C.
  continuePart3(){
    let values = this.form3.value;
    this.parteC_real = (this.mapParte3(values.n2, 2) + this.mapParte3(values.n5, 5) + this.mapParte3(values.n12, 12));
    this.parteC_investigador = (this.mapParte3(values.n4, 4) + this.mapParte3(values.n9, 9) + this.mapParte3(values.n10, 10));
    this.parteC_social = (this.mapParte3(values.n3, 3) + this.mapParte3(values.n14, 14) + this.mapParte3(values.n18, 18));
    this.parteC_convencional = (this.mapParte3(values.n1, 1) + this.mapParte3(values.n8, 8) + this.mapParte3(values.n13, 13));
    this.parteC_emprendedor = (this.mapParte3(values.n6, 6) + this.mapParte3(values.n7, 7) + this.mapParte3(values.n17, 17));
    this.parteC_artista = (this.mapParte3(values.n11, 11) + this.mapParte3(values.n15, 15) + this.mapParte3(values.n16, 16));
    this.parteC_arr = [
      this.parteC_real, 
      this.parteC_investigador,
      this.parteC_social, 
      this.parteC_convencional, 
      this.parteC_emprendedor, 
      this.parteC_artista
    ];
    //console.log(this.parteC_arr);
    this.progress += 1;
  }

  // A 1
  // B 2 
  // C 3


  // Parte 4. Autoconocimiento Parte D.
  continuePart4(){
    let values = this.form4.value;
    //console.log(values);
    this.parteD_real = ((values.n1 == "5" ? 1:0) + (values.n2 == "6" ? 1:0) + (values.n3 == "3" ? 1:0) + (values.n4 == "2" ? 1:0) + (values.n5 == "4" ? 1:0));
    this.parteD_investigador = ((values.n1 == "1" ? 1:0) + (values.n2 == "3" ? 1:0) + (values.n3 == "5" ? 1:0) + (values.n4 == "6" ? 1:0) + (values.n5 == "3" ? 1:0));
    this.parteD_social = ((values.n1 == "4" ? 1:0) + (values.n2 == "5" ? 1:0) + (values.n3 == "1" ? 1:0) + (values.n4 == "5" ? 1:0) + (values.n5 == "6" ? 1:0));
    this.parteD_convencional = ((values.n1 == "2" ? 1:0) + (values.n2 == "1" ? 1:0) + (values.n3 == "6" ? 1:0) + (values.n4 == "4" ? 1:0) + (values.n5 == "2" ? 1:0));
    this.parteD_emprendedor = ((values.n1 == "3" ? 1:0) + (values.n2 == "4" ? 1:0) + (values.n3 == "2" ? 1:0) + (values.n4 == "1" ? 1:0) + (values.n5 == "5" ? 1:0));
    this.parteD_artista = ((values.n1 == "6" ? 1:0) + (values.n2 == "2" ? 1:0) + (values.n3 == "4" ? 1:0) + (values.n4 == "3" ? 1:0) + (values.n5 == "1" ? 1:0));
    this.parteD_arr = [
      this.parteD_real, 
      this.parteD_investigador,
      this.parteD_social, 
      this.parteD_convencional, 
      this.parteD_emprendedor, 
      this.parteD_artista
    ];
    //console.log(this.parteD_arr);

    // Cuadro Resumen 1.
    this.resumen_real = this.parteA_real + this.parteB_real + this.parteC_real + this.parteD_real;
    this.resumen_investigador = this.parteA_investigador + this.parteB_investigador + this.parteC_investigador + this.parteD_investigador;
    this.resumen_social = this.parteA_social + this.parteB_social + this.parteC_social + this.parteD_social;
    this.resumen_convencional = this.parteA_convencional + this.parteB_convencional + this.parteC_convencional + this.parteD_convencional;
    this.resumen_emprendedor = this.parteA_emprendedor + this.parteB_emprendedor + this.parteC_emprendedor + this.parteD_emprendedor;
    this.resumen_artista = this.parteA_artista + this.parteB_artista + this.parteC_artista + this.parteD_artista;

    //console.log("Resumen 1");
    //console.log(this.resumen_real);
    //console.log(this.resumen_investigador);
    //console.log(this.resumen_social);
    //console.log(this.resumen_convencional);
    //console.log(this.resumen_emprendedor);
    //console.log(this.resumen_artista);

    this.progress += 1;

  }

  // Parte 5. Actividades.
  continuePart5(){
    let values = this.form5.value;
    this.parteActividades_real = (this.N(values.real1) + this.N(values.real2) + this.N(values.real3) + this.N(values.real4) + this.N(values.real5) + this.N(values.real6) + this.N(values.real7) + this.N(values.real8) + this.N(values.real9) + this.N(values.real10) + this.N(values.real11));
    this.parteActividades_investigador = (this.N(values.investigador1) + this.N(values.investigador2) + this.N(values.investigador3) + this.N(values.investigador4) + this.N(values.investigador5) + this.N(values.investigador6) + this.N(values.investigador7) + this.N(values.investigador8) + this.N(values.investigador9) + this.N(values.investigador10) + this.N(values.investigador11));
    this.parteActividades_social = (this.N(values.social1) + this.N(values.social2) + this.N(values.social3) + this.N(values.social4) + this.N(values.social5) + this.N(values.social6) + this.N(values.social7) + this.N(values.social8) + this.N(values.social9) + this.N(values.social10) + this.N(values.social11));
    this.parteActividades_emprendedor = (this.N(values.emprendedor1) + this.N(values.emprendedor2) + this.N(values.emprendedor3) + this.N(values.emprendedor4) + this.N(values.emprendedor5) + this.N(values.emprendedor6) + this.N(values.emprendedor7) + this.N(values.emprendedor8) + this.N(values.emprendedor9) + this.N(values.emprendedor10) + this.N(values.emprendedor11));
    this.parteActividades_artista = (this.N(values.artista1) + this.N(values.artista2) + this.N(values.artista3) + this.N(values.artista4) + this.N(values.artista5) + this.N(values.artista6) + this.N(values.artista7) + this.N(values.artista8) + this.N(values.artista9) + this.N(values.artista10) + this.N(values.artista11));
    this.parteActividades_convencional = (this.N(values.convencional1) + this.N(values.convencional2) + this.N(values.convencional3) + this.N(values.convencional4) + this.N(values.convencional5) + this.N(values.convencional6) + this.N(values.convencional7) + this.N(values.convencional8) + this.N(values.convencional9) + this.N(values.convencional10) + this.N(values.convencional11));
    this.parteActividades_arr = [
      this.parteActividades_real, 
      this.parteActividades_investigador,
      this.parteActividades_social, 
      this.parteActividades_convencional, 
      this.parteActividades_emprendedor, 
      this.parteActividades_artista
    ];
    //console.log(this.parteActividades_arr);
    this.progress += 1;
  }

  // Parte 6. Habilidades.
  continuePart6(){
    let values = this.form6.value;
    this.parteHabilidades_real = (this.N(values.real1) + this.N(values.real2) + this.N(values.real3) + this.N(values.real4) + this.N(values.real5) + this.N(values.real6) + this.N(values.real7) + this.N(values.real8) + this.N(values.real9) + this.N(values.real10) + this.N(values.real11));
    this.parteHabilidades_investigador = (this.N(values.investigador1) + this.N(values.investigador2) + this.N(values.investigador3) + this.N(values.investigador4) + this.N(values.investigador5) + this.N(values.investigador6) + this.N(values.investigador7) + this.N(values.investigador8) + this.N(values.investigador9) + this.N(values.investigador10) + this.N(values.investigador11));
    this.parteHabilidades_social = (this.N(values.social1) + this.N(values.social2) + this.N(values.social3) + this.N(values.social4) + this.N(values.social5) + this.N(values.social6) + this.N(values.social7) + this.N(values.social8) + this.N(values.social9) + this.N(values.social10) + this.N(values.social11));
    this.parteHabilidades_emprendedor = (this.N(values.emprendedor1) + this.N(values.emprendedor2) + this.N(values.emprendedor3) + this.N(values.emprendedor4) + this.N(values.emprendedor5) + this.N(values.emprendedor6) + this.N(values.emprendedor7) + this.N(values.emprendedor8) + this.N(values.emprendedor9) + this.N(values.emprendedor10) + this.N(values.emprendedor11));
    this.parteHabilidades_artista = (this.N(values.artista1) + this.N(values.artista2) + this.N(values.artista3) + this.N(values.artista4) + this.N(values.artista5) + this.N(values.artista6) + this.N(values.artista7) + this.N(values.artista8) + this.N(values.artista9) + this.N(values.artista10) + this.N(values.artista11));
    this.parteHabilidades_convencional = (this.N(values.convencional1) + this.N(values.convencional2) + this.N(values.convencional3) + this.N(values.convencional4) + this.N(values.convencional5) + this.N(values.convencional6) + this.N(values.convencional7) + this.N(values.convencional8) + this.N(values.convencional9) + this.N(values.convencional10) + this.N(values.convencional11));
    this.parteHabilidades_arr = [
      this.parteHabilidades_real, 
      this.parteHabilidades_investigador,
      this.parteHabilidades_social, 
      this.parteHabilidades_convencional, 
      this.parteHabilidades_emprendedor, 
      this.parteHabilidades_artista
    ];
    //console.log(this.parteHabilidades_arr);
    this.progress += 1;
  }

  // Parte 7. Ocupaciones.
  continuePart7(){
    let values = this.form7.value;
    this.parteOcupaciones_real = (this.N(values.real1) + this.N(values.real2) + this.N(values.real3) + this.N(values.real4) + this.N(values.real5) + this.N(values.real6) + this.N(values.real7) + this.N(values.real8) + this.N(values.real9) + this.N(values.real10) + this.N(values.real11) + this.N(values.real12) + this.N(values.real13));
    this.parteOcupaciones_investigador = (this.N(values.investigador1) + this.N(values.investigador2) + this.N(values.investigador3) + this.N(values.investigador4) + this.N(values.investigador5) + this.N(values.investigador6) + this.N(values.investigador7) + this.N(values.investigador8) + this.N(values.investigador9) + this.N(values.investigador10) + this.N(values.investigador11)) + this.N(values.investigador12);
    this.parteOcupaciones_social = (this.N(values.social1) + this.N(values.social2) + this.N(values.social3) + this.N(values.social4) + this.N(values.social5) + this.N(values.social6) + this.N(values.social7) + this.N(values.social8) + this.N(values.social9) + this.N(values.social10) + this.N(values.social11) + this.N(values.social12) + this.N(values.social13));
    this.parteOcupaciones_emprendedor = (this.N(values.emprendedor1) + this.N(values.emprendedor2) + this.N(values.emprendedor3) + this.N(values.emprendedor4) + this.N(values.emprendedor5) + this.N(values.emprendedor6) + this.N(values.emprendedor7) + this.N(values.emprendedor8) + this.N(values.emprendedor9) + this.N(values.emprendedor10) + this.N(values.emprendedor11) + this.N(values.emprendedor12) + this.N(values.emprendedor13));
    this.parteOcupaciones_artista = (this.N(values.artista1) + this.N(values.artista2) + this.N(values.artista3) + this.N(values.artista4) + this.N(values.artista5) + this.N(values.artista6) + this.N(values.artista7) + this.N(values.artista8) + this.N(values.artista9) + this.N(values.artista10) + this.N(values.artista11) + this.N(values.artista12) + this.N(values.artista13));
    this.parteOcupaciones_convencional = (this.N(values.convencional1) + this.N(values.convencional2) + this.N(values.convencional3) + this.N(values.convencional4) + this.N(values.convencional5) + this.N(values.convencional6) + this.N(values.convencional7) + this.N(values.convencional8) + this.N(values.convencional9) + this.N(values.convencional10) + this.N(values.convencional11) + this.N(values.convencional12) + this.N(values.convencional13));
    this.parteOcupaciones_arr = [
      this.parteOcupaciones_real, 
      this.parteOcupaciones_investigador,
      this.parteOcupaciones_social, 
      this.parteOcupaciones_convencional, 
      this.parteOcupaciones_emprendedor, 
      this.parteOcupaciones_artista
    ];
    //console.log(this.parteOcupaciones_arr);
    this.progress += 1;
  }

  // Parte 8. Autoevaluación
  continuePart8(){
    let values = this.form8.value;
    this.arr_real = [this.parteActividades_real, this.parteHabilidades_real, this.parteOcupaciones_real, parseInt(values.real1), parseInt(values.real2)];
    this.arr_real.sort();
    //console.log(this.arr_real);

    this.arr_investigador = [this.parteActividades_investigador, this.parteHabilidades_investigador, this.parteOcupaciones_investigador, parseInt(values.investigador1), parseInt(values.investigador2)];
    this.arr_investigador.sort();
    //console.log(this.arr_investigador);
    
    this.arr_social = [this.parteActividades_social, this.parteHabilidades_social, this.parteOcupaciones_social, parseInt(values.social1), parseInt(values.social2)];
    this.arr_social.sort();
    //console.log(this.arr_social);

    
    this.arr_emprendedor = [this.parteActividades_emprendedor, this.parteHabilidades_emprendedor, this.parteOcupaciones_emprendedor, parseInt(values.emprendedor1), parseInt(values.emprendedor2)];
    this.arr_emprendedor.sort();
    //console.log(this.arr_emprendedor);
    
    this.arr_artista = [this.parteActividades_artista, this.parteHabilidades_artista, this.parteOcupaciones_artista, parseInt(values.artista1), parseInt(values.artista2)];
    this.arr_artista.sort();
    //console.log(this.arr_artista);
    
    this.arr_convencional = [this.parteActividades_convencional, this.parteHabilidades_convencional, this.parteOcupaciones_convencional, parseInt(values.convencional1), parseInt(values.convencional2)];
    this.arr_convencional.sort();
    //console.log(this.arr_convencional);

    // Autoevalución 1.
    this.auto1_arr = [parseInt(values.real1), parseInt(values.investigador1), parseInt(values.social1), parseInt(values.emprendedor1), parseInt(values.artista1), parseInt(values.convencional1)];
    //console.log(this.auto1_arr);

    // Autoevaluación 2.
    this.auto2_arr = [parseInt(values.real2), parseInt(values.investigador2), parseInt(values.social2), parseInt(values.emprendedor2), parseInt(values.artista2), parseInt(values.convencional2)];
    //console.log(this.auto2_arr);


    this.progress += 1;
  }
  
  endTest(){
    // Cuenta para cada una de las dimensiones cuantas veces obtuviste un primer lugar (máximo puntaje), un segundo lugar y un tercer lugar:
    this.resultado_realista = this.arr_real[0] * 3 + this.arr_real[1] * 2 + this.arr_real[2] * 1 + this.resumen_real;
    this.resultado_investigador = this.arr_investigador[0] * 3 + this.arr_investigador[1] * 2 + this.arr_investigador[2] * 1 + this.resumen_investigador;
    this.resultado_social = this.arr_social[0] * 3 + this.arr_social[1] * 2 + this.arr_social[2] * 1 + this.resumen_social;
    this.resultado_emprendedor = this.arr_emprendedor[0] * 3 + this.arr_emprendedor[1] * 2 + this.arr_emprendedor[2] * 1 + this.resumen_emprendedor;
    this.resultado_artista = this.arr_artista[0] * 3 + this.arr_artista[1] * 2 + this.arr_artista[2] * 1 + this.resumen_artista;
    this.resultado_convencional = this.arr_convencional[0] * 3 + this.arr_convencional[1] * 2 + this.arr_convencional[2] * 1 + this.resumen_convencional;
    this.total_arr = [
      this.resultado_realista,
      this.resultado_investigador,
      this.resultado_social,
      this.resultado_emprendedor,
      this.resultado_artista,
      this.resultado_convencional
    ];

    let i = 0;
    while(i <= this.total_arr.length){
      let element = this.total_arr[i];
      for(let j = i + 1; j < this.total_arr.length; j++){
          let element2 = this.total_arr[j];
          if(element == element2 && i != j){
             this.total_arr[i] += 0.5;
          }
      }
      i++;
    }
    /*while(i <= this.total_arr.length){
        let centinela = false;
        let element = this.total_arr[i];
        for(let j = 0; j <= this.total_arr.length; j++){
            let element2 = this.total_arr[j];
            if(element == element2 && i != j){
               this.total_arr[i] += 1;
               centinela = true;
            }
        }
        if(centinela == false){
           i++;
        }
    }*/
    this.isLoading = true;

    //console.log("Total result");
    //console.log(this.total_arr);

    // JSONS.
    this.testService.sendTest(
      this.parteA_arr,
      this.parteB_arr,
      this.parteC_arr,
      this.parteD_arr,
      this.parteActividades_arr, 
      this.parteHabilidades_arr, 
      this.parteOcupaciones_arr, 
      this.auto1_arr, 
      this.auto2_arr, 
      this.total_arr
    ).subscribe(
      (response) => {
        this.isLoading = false;
        this.router.navigate(["/dashboard"]);
      }, (err) => {
        this.isLoading = false;
        //console.log(err);
    });
      //console.log("vector final: ", this.total_arr);
  }

  back(){
    this.progress -= 1;
  }

}

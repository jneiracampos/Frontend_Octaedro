import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TestService } from '../services/test.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Chart, registerables, ChartOptions, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
//import { MdbTableDirective } from 'angular-bootstrap-md';
import { AnimationOptions } from 'ngx-lottie';
import { round, random } from 'mathjs';
import { formatNumber } from '@angular/common';
//import { coerceNumberProperty } from '@angular/cdk/coercion';

Chart.register(...registerables);
Chart.register({
  id: 'pluginDataLabels',
});
//Chart["plugins"] = ChartDataLabels;

//Chart.plugins.register()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  //ChartDataLabels = ChartDataLabels;
  formatNumber = formatNumber;
  parseInt = parseInt;

  time: number = 0;
  interval: any;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  optionsSer: AnimationOptions = {
    path: '../assets/animations/ser.json',
  };

  optionsWomen: AnimationOptions = {
    path: '../assets/animations/women.json',
  };

  tab = 0;
  testAvailable: string = '0';
  surveyCompleted: string = '0';
  noTest = false;
  mapData = [];
  predictData: any;
  userName: string;
  isAdmin: string;
  searchData: any;
  finalData = {};
  imageUrl: any;
  dataLocalStorage: any;
  descriptionUser: string;
  profesionUser: string;
  profesionRecomend: any;
  userInfo: any;

  // Mapa de objetivos ONU: Imágen PNG.
  mapaObjetivos = {
    '1. FIN DE LA POBREZA': '../assets/iconos_objetivos/1_pobreza.png',
    '2. PONER FIN AL HAMBRE': '../assets/iconos_objetivos/2_hambre.png',
    '3. SALUD Y BIENESTAR ':
      '../assets/iconos_objetivos/3_salud_y_bienestar.png',
    '4. EDUCACIÓN DE CALIDAD': '../assets/iconos_objetivos/4_educacion.png',
    '5. IGUALDAD DE GÉNERO': '../assets/iconos_objetivos/5_genero.png',
    '6. AGUA LIMPIA Y SANEAMIENTO':
      '../assets/iconos_objetivos/6_agua_limpia.png',
    '7. ENERGIA ASEQUIBLE Y NO DOMINANTE':
      '../assets/iconos_objetivos/7_energia.png',
    '8. TRABAJO DECENTE Y CRECIMIENTO ECONÓMICO':
      '../assets/iconos_objetivos/8_trabajo_decente.png',
    '9. INDUSTRIA, INNOVACIÓN E INFRAESTRUCTURA':
      '../assets/iconos_objetivos/9_industria.png',
    '10. REDUCCIÓN DE LAS DESIGUALDADES':
      '../assets/iconos_objetivos/10_desigualdades.png',
    '11. CIUDADES Y COMUNIDADES SOSTENIBLES':
      '../assets/iconos_objetivos/11_ciudades_sostenibles.png',
    '12. PRODUCCIÓN Y CONSUMO RESPONSABLE':
      '../assets/iconos_objetivos/12_produccion_responsable.png',
    '13. ACCIÓN POR EL CLIMA': '../assets/iconos_objetivos/13_accion_clima.png',
    '14. VIDA SUBMARINA ': '../assets/iconos_objetivos/14_vida_submarina.png',
    '15. VIDA DE ECOSISTEMAS TERRESTRES ':
      '../assets/iconos_objetivos/15_vida.png',
    '16. PAZ, JUSTICIA E INSTITUCIONES SÓLIDAS':
      '../assets/iconos_objetivos/16_paz.png',
    '17. ALIANZA PARA LOGRAR LOS OBJETIVOS':
      '../assets/iconos_objetivos/17_alianzas_objetivos.png',
  };

  myChart1: Chart;
  myChart2: Chart;
  myChart3: Chart;
  myChart4: Chart;
  myChart5: Chart;
  myChart6: Chart;
  myChart7: Chart;
  myChart8: Chart;
  myChart9: Chart;
  myChart10: Chart;
  myChartTotal: Chart;
  doughnut: Chart;

  finalResults: any;
  labelsResults = [];
  mapaColores: Object;
  podium = [];
  podiumHolland = [];
  version: String;

  ocupaciones_promedio = 0;
  habilidades_promedio = 0;
  actividades_promedio = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private testService: TestService
  ) {}

  ngOnInit(): void {
    this.startTimer();

    this.version = environment.version;

    /* Verificar que el usuario esté logeado */
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (!this.userIsAuthenticated) {
      this.router.navigate(['/login']);
    }

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        //console.log(this.userIsAuthenticated);
        if (!this.userIsAuthenticated) {
          this.router.navigate(['/login']);
        }
      });

    this.userName = this.authService.getUserName();
    this.authService.getIsAdmin().subscribe((res) => {
      this.isAdmin = res['results']['is_admin'] == 1 ? 'true' : 'false';
    });
    this.authService.getTestAvailable().subscribe((res) => {
      this.testAvailable = res['test_available'] == 1 ? '1' : '0';
    });
    this.authService.getSurveyCompleted().subscribe((res) => {
      this.surveyCompleted = res['survey_completed'] == 1 ? '1' : '0';
    });

    //console.log(this.isAdmin);

    /*  Obtener predict del test */
    this.testService.getPrediction().subscribe((res) => {
      /*res["programas_academicos"].forEach(element => {
        element.levenshtein = round(element.levenshtein, 2)
      })*/
      this.predictData = res;
      this.profesionRecomend = [
        this.predictData.programas_academicos[0].programa_academico,
        this.predictData.programas_academicos[1].programa_academico,
        this.predictData.programas_academicos[2].programa_academico,
      ];
      // localStorage.setItem('recomend', JSON.stringify(this.profesionRecomend));
      this.onSave()
      let dimensiones =
        this.predictData['programas_academicos'][0]['dimensiones'];
      let map_characters = {
        E: 'Emprendedor',
        R: 'Realista',
        S: 'Social',
        C: 'Convencional',
        I: 'Investigador',
        A: 'Artístico',
      };
      for (let i = 0; i < dimensiones.length; i++) {
        let character = dimensiones[i];
        let category = map_characters[character];
        this.podiumHolland.push(category);
      }

      //console.log("holland podium: ", this.podiumHolland);

      //this.podiumHolland =
      //console.log(dimensiones);
    });

    /* Search Data */
    /*this.testService.getInfo().subscribe((res) => {
      this.searchData = res;
      console.log(this.searchData);
    });*/
    // this.getStorage();
    this.getLocalStorage()
    // this.onSave()
  }

  onSave() {
    const dataSend = {
      info: {
        info: this.userInfo,
        userProfesion: this.profesionUser,
        description: this.descriptionUser,
        userPhoto: this.imageUrl,
        programs: this.profesionRecomend,
      },
    };
    localStorage.setItem('userdata', JSON.stringify(dataSend.info));
    this.testService.getInfoUser(dataSend).subscribe((res) => {
      JSON.stringify(res);
    });
  }

 getLocalStorage() {
    this.dataLocalStorage = JSON.parse(localStorage.getItem('userdata'));
    this.userInfo =
      this.dataLocalStorage.info !== null
        ? this.dataLocalStorage.info
        : 'No tienes programas';
    this.descriptionUser =
      this.dataLocalStorage.description !== ''
        ? this.dataLocalStorage.description
        : 'No tienes descripcion';
    this.profesionUser =
      this.dataLocalStorage.userProfesion !== ''
        ? this.dataLocalStorage.userProfesion
        : 'No tienes profesion';
    this.imageUrl =
      this.dataLocalStorage.userPhoto !== ''
        ? this.dataLocalStorage.userPhoto
        : 'https://img.icons8.com/bubbles/100/000000/user.png';
    this.profesionRecomend =
      this.dataLocalStorage.programs !== ''
        ? this.dataLocalStorage.programs
        : 'No tienes profesion';
  }

  comparar(a: number, b: number) {
    return a - b;
  }

  changeTab(number: number) {
    this.tab = number;
    if (number == 1) {
      this.loadTestResults();
    }
    /*this.myChart1.destroy();
    this.myChart2.destroy();
    this.myChart3.destroy();
    this.myChart4.destroy();
    this.myChart5.destroy();
    this.myChart6.destroy();
    this.myChart7.destroy();
    this.myChart8.destroy();
    this.myChart9.destroy();
    this.myChart10.destroy();
    this.myChartTotal.destroy();*/
  }

  onLogout() {
    this.authService.logout();
  }

  refresh() {
    window.location.reload();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    if (this.myChart1) {
      this.myChart1.destroy();
      this.myChart2.destroy();
      this.myChart3.destroy();
      this.myChart4.destroy();
      this.myChart5.destroy();
      this.myChart6.destroy();
      this.myChart7.destroy();
      this.myChart8.destroy();
      this.myChart9.destroy();
      this.myChart10.destroy();
      this.myChartTotal.destroy();
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else if (this.time === 3) {
        this.tab = 1;
        clearInterval(this.interval);
        this.loadTestResults();
      } else {
        this.time++;
      }
      console.log(this.time);
    }, 1000);
  }

  getStorage() {
    this.dataLocalStorage = JSON.parse(localStorage.getItem('userdata'));
    this.imageUrl = this.dataLocalStorage.userPhoto;
  }

  loadTestResults() {
    /* Obtener resultados del test */
    this.testService.getTest().subscribe(
      (res) => {
        let data = {};
        Object.values(res).forEach((element, idx) => {
          // console.log("Element: ", element, idx + 1);
          let etapa = element.etapa;
          let total =
            parseInt(element.realista) +
            parseInt(element.investigador) +
            parseInt(element.social) +
            parseInt(element.emprendedor) +
            parseInt(element.artistico) +
            parseInt(element.convencional);
          let array = [
            round((parseFloat(element.realista) / total) * 100, 2), // Realista
            round((parseFloat(element.investigador) / total) * 100, 2), // Investigador
            round((parseFloat(element.social) / total) * 100, 2), // Social
            round((parseFloat(element.emprendedor) / total) * 100, 2), // Emprendedor
            round((parseFloat(element.artistico) / total) * 100, 2), // Artístico
            round((parseFloat(element.convencional) / total) * 100, 2), // Convencional
          ];
          // console.log("array", array);
          //console.log(element);
          //console.log(array);
          data['p' + etapa.toString()] = array;

          if (etapa == 10) {
            this.finalData['realista'] = array[0];
            this.finalData['investigador'] = array[1];
            this.finalData['social'] = array[2];
            this.finalData['emprendedor'] = array[3];
            this.finalData['artistico'] = array[4];
            this.finalData['convencional'] = array[5];
            //console.log("Final Data: ", this.finalData);

            this.podium = [
              parseFloat(element.realista),
              parseFloat(element.investigador),
              parseFloat(element.social),
              parseFloat(element.emprendedor),
              parseFloat(element.artistico),
              parseFloat(element.convencional),
            ];
            //console.log("Podio 1:", this.podium);
          }

          //console.log("Final Data: ", this.finalData);
        });

        const labels = [
          'Realista',
          'Investigador',
          'Social',
          'Emprendedor',
          'Artístico',
          'Convencional',
        ];
        /*this.mapaColores = {
        "Realista": "rgba(220, 53, 69, 0.3)", 
        "Investigador": "rgba(255, 193, 7, 0.3)",
        "Social": "rgba(32, 201, 151, 0.3)", 
        "Emprendedor": "rgba(13, 202, 240, 0.3)", 
        "Artístico": "rgba(13, 110, 253, 0.3)", 
        "Convencional": "rgba(201, 151, 198, 0.3)"
      }*/
        this.mapaColores = {
          Realista: 'rgba(220, 53, 69, 0.3)',
          Investigador: 'rgba(32, 201, 151, 0.3)',
          Social: 'rgba(201, 151, 198, 0.3)',
          Emprendedor: 'rgba(255, 193, 7, 0.3)',
          Artístico: 'rgba(247, 150, 70, 0.3)',
          Convencional: 'rgba(13, 202, 240, 0.3)',
        };
        /*this.mapaColores = {
        "Realista": "rgba(192, 80, 77, 0.5)", 
        "Investigador": "rgba(60, 135, 97, 0.5)",
        "Social": "rgba(232, 75, 217, 0.5)", 
        "Emprendedor": "rgba(211, 139, 74, 0.5)", 
        "Artístico": "rgba(247, 150, 70, 0.5)", 
        "Convencional": "rgba(79, 129, 189, 0.5)"
      }*/
        this.finalResults = data['p10'];
        // console.log(this.finalResults, );

        // Primer lugar hasta sexto lugar.
        //let copyResults = [];
        let copyResults2 = [];
        /*data["p10"].forEach(element => {
        this.podium.push(element + random() / 1000);
      });*/
        copyResults2 = this.podium.slice();
        this.podium.sort(this.comparar);
        //console.log("Podio: ", this.podium);
        this.podium.forEach((element) => {
          var index = copyResults2.indexOf(element);
          this.labelsResults.splice(0, 0, labels[index]);
        });

        for (var i = 0; i < data['p5'].length; i++) {
          this.actividades_promedio += data['p5'][i]; //don't forget to add the base
        }
        for (var i = 0; i < data['p6'].length; i++) {
          this.habilidades_promedio += data['p6'][i]; //don't forget to add the base
        }
        for (var i = 0; i < data['p7'].length; i++) {
          this.ocupaciones_promedio += data['p7'][i]; //don't forget to add the base
        }
        this.actividades_promedio = this.actividades_promedio / 6;
        this.habilidades_promedio = this.habilidades_promedio / 6;
        this.ocupaciones_promedio = this.ocupaciones_promedio / 6;

        // Parte A
        this.myChart1 = new Chart('myChart1', {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [
              {
                data: data['p1'],
                borderColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
                backgroundColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
                hoverOffset: 2,
              },
            ],
          },
          options: {
            layout: {
              padding: 10,
            },
            plugins: {},
          },
          //plugins: [plugin]
        });

        // Parte B
        this.myChart2 = new Chart('myChart2', {
          type: 'polarArea',
          data: {
            labels: labels,
            datasets: [
              {
                data: data['p2'],
                borderColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
                backgroundColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
              },
            ],
          },
          options: {
            layout: {
              padding: 10,
            },
            plugins: {},
          },
        });

        // Parte C
        this.myChart3 = new Chart('myChart3', {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [
              {
                data: data['p3'],
                borderColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
                backgroundColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
              },
            ],
          },
          options: {
            layout: {
              padding: 10,
            },
            plugins: {},
          },
        });

        // Parte D
        this.myChart4 = new Chart('myChart4', {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [
              {
                data: data['p4'],
                borderColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
                backgroundColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
              },
            ],
          },
          options: {
            layout: {
              padding: 10,
            },
            plugins: {},
          },
        });

        // Actividades
        this.myChart5 = new Chart('myChart5', {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [
              {
                data: data['p5'],
                borderColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
                backgroundColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
              },
            ],
          },
          options: {
            layout: {
              padding: 10,
            },
            plugins: {},
          },
        });
        // Habilidades
        this.myChart6 = new Chart('myChart6', {
          type: 'polarArea',
          data: {
            labels: labels,
            datasets: [
              {
                data: data['p6'],
                borderColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
                backgroundColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
              },
            ],
          },
          options: {
            layout: {
              padding: 10,
            },
            plugins: {},
          },
        });
        // Ocupaciones
        this.myChart7 = new Chart('myChart7', {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [
              {
                data: data['p7'],
                borderColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
                backgroundColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
              },
            ],
          },
          options: {
            layout: {
              padding: 10,
            },
            plugins: {},
          },
        });
        // Auto 1.
        this.myChart8 = new Chart('myChart8', {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [
              {
                data: data['p8'],
                borderColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
                backgroundColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
              },
            ],
          },
          options: {
            layout: {
              padding: 10,
            },
            plugins: {},
          },
        });
        // Auto 2
        this.myChart9 = new Chart('myChart9', {
          type: 'polarArea',
          data: {
            labels: labels,
            datasets: [
              {
                data: data['p9'],
                borderColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
                backgroundColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(13, 110, 253, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
              },
            ],
          },
          options: {
            layout: {
              padding: 10,
            },
            plugins: {},
          },
        });
        // Todas combinadas.
        this.myChartTotal = new Chart('myChartTotal', {
          type: 'radar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Parte A',
                data: data['p1'],
                borderColor: 'rgba(220, 53, 69, 0.6)',
                backgroundColor: 'rgba(220, 53, 69, 0.6)',
              },
              {
                label: 'Parte B',
                data: data['p2'],
                borderColor: 'rgba(255, 193, 7, 0.6)',
                backgroundColor: 'rgba(255, 193, 7, 0.6)',
              },
              {
                label: 'Parte C',
                data: data['p3'],
                borderColor: 'rgba(32, 201, 151, 0.6)',
                backgroundColor: 'rgba(32, 201, 151, 0.6)',
              },
              {
                label: 'Parte D',
                data: data['p4'],
                borderColor: 'rgba(13, 202, 240, 0.6)',
                backgroundColor: 'rgba(13, 202, 240, 0.6)',
              },
              {
                label: 'Actividades',
                data: data['p5'],
                borderColor: 'rgba(13, 110, 253, 0.6)',
                backgroundColor: 'rgba(13, 110, 253, 0.6)',
              },
              {
                label: 'Habilidades',
                data: data['p6'],
                borderColor: 'rgba(231, 131, 181, 0.6)',
                backgroundColor: 'rgba(231, 131, 181, 0.6)',
              },
              {
                label: 'Ocupaciones',
                data: data['p7'],
                borderColor: 'rgba(161, 193, 129, 0.4)',
                backgroundColor: 'rgba(161, 193, 129, 0.4)',
              },
              {
                label: 'Autoevaluación 1',
                data: data['p8'],
                borderColor: 'rgba(228, 87, 46, 0.4)',
                backgroundColor: 'rgba(228, 87, 46, 0.4)',
              },
              {
                label: 'Autoevaluación 2',
                data: data['p9'],
                borderColor: 'rgba(41, 51, 92, 0.4)',
                backgroundColor: 'rgba(41, 51, 92, 0.4)',
              },
              {
                label: 'Total agregado',
                data: data['p10'],
                borderColor: 'rgba(102, 155, 188, 0.4)',
                backgroundColor: 'rgba(102, 155, 188, 0.4)',
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Resultado test',
              },
            },
            scales: {},
          },
        });
      },
      (err) => {
        //console.log("error");
        this.router.navigate(['/test']);
      }
    );
  }
}

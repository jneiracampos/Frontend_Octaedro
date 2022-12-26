import { Component, OnInit } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TestService } from '../services/test.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { round, random } from 'mathjs';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  userName: string;
  isAdmin: string;
  email: string;
  testAvailable: string;
  form: FormGroup;
  form2: FormGroup;
  descriptionUser: string;
  profesionUser: string;
  finalResults: any;
  finalData = {};
  mapaColores: Object;
  podium = [];
  labelsResults = [];
  myChart: Chart;
  dataLocalStorage: any;
  userInfo: any;
  userDescription: Object;
  userProfesion: Object;
  imageUrl: File;
  profesionRecomend:any
  photeSelected: String | ArrayBuffer;

  ocupaciones_promedio = 0;
  habilidades_promedio = 0;
  actividades_promedio = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private testService: TestService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        description: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(250)],
        }),
      },
      { validators: this.checkPasswords }
    );

    this.form2 = new FormGroup(
      {
        profesion: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(40)],
        }),
      },
      { validators: this.checkPasswordsTwo }
    );

    this.getLocalStorage();
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
    this.email = this.authService.getEmail();
    //this.isAdmin = this.authService.getIsAdmin();
    this.authService.getTestAvailable().subscribe((res) => {
      this.testAvailable = res['test_available'] == 1 ? '1' : '0';
    });

    this.loadTestResults();
  }

  loadTestResults() {
    /* Obtener resultados del test */
    this.testService.getTest().subscribe(
      (res) => {
        let data = {};
        Object.values(res).forEach((element, idx) => {
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
          }
        });

        const labels = [
          'Realista',
          'Investigador',
          'Social',
          'Emprendedor',
          'Artístico',
          'Convencional',
        ];
        this.mapaColores = {
          Realista: 'rgba(220, 53, 69, 0.3)',
          Investigador: 'rgba(32, 201, 151, 0.3)',
          Social: 'rgba(201, 151, 198, 0.3)',
          Emprendedor: 'rgba(255, 193, 7, 0.3)',
          Artístico: 'rgba(247, 150, 70, 0.3)',
          Convencional: 'rgba(13, 202, 240, 0.3)',
        };

        this.finalResults = data['p10'];

        let copyResults2 = [];
        copyResults2 = this.podium.slice();
        this.podium.sort(this.comparar);
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
        this.myChart = new Chart('myChart', {
          type: 'polarArea',
          data: {
            labels: labels,
            datasets: [
              {
                data: data['p9'],
                borderColor: [
                  'rgba(220, 53, 69, 0.5)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(247, 150, 70, 0.6)',
                  'rgba(231, 131, 181, 0.6)',
                ],
                backgroundColor: [
                  'rgba(220, 53, 69, 0.6)',
                  'rgba(255, 193, 7, 0.6)',
                  'rgba(32, 201, 151, 0.6)',
                  'rgba(13, 202, 240, 0.6)',
                  'rgba(247, 150, 70, 0.6)',
                  'rgba(201, 151, 198, 0.6)',
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
      },
      (err) => {
        //console.log("error");
        this.router.navigate(['/test']);
      }
    );
  }

  // saveInfo() {
  //   this.description = this.form.value.description;
  //   console.log(this.description, 'dnnln,bcbc');
  //   this.testService.getInfoUser(this.description).subscribe(
  //     (res) => {
  //       console.log(res, 'esta es la redkjksdhjsk')
  //     });
  // }

  savePhotos($event: Event) {
    const file = ($event.target as HTMLInputElement).files[0];
    this.convertToBase64(file);
  }

  convertToBase64(file: File) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });
    observable.subscribe((d) => {
      this.imageUrl = d;
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
      this.testService.getInfoUser(dataSend).subscribe((res) => {})
    });
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      subscriber.next(fileReader.result);
      subscriber.complete();
    };
    fileReader.onerror = () => {
      subscriber.error(fileReader.result);
      subscriber.complete();
    };
  }

  saveInfo() {
    this.descriptionUser = this.form.value.description;
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
    this.testService.getInfoUser(dataSend).subscribe((res) => {});
  }

  saveProfesion() {
    this.profesionUser = this.form2.value.profesion;
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
    this.testService.getInfoUser(dataSend).subscribe((res) => {});
  }

  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    return group.get('description').value;
  }

  checkPasswordsTwo(group: FormGroup) {
    // here we have the 'passwords' group
    return group.get('profesion').value;
  }
  comparar(a: number, b: number) {
    return a - b;
  }

  setLocalStorage() {}
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


  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}

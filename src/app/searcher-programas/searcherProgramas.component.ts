import {
  Component,
  HostListener,
  ViewChild,
  OnInit,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { TestService } from '../services/test.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { formatNumber } from '@angular/common';
@Component({
  selector: 'app-searcher-programas',
  templateUrl: './searcherProgramas.component.html',
  styleUrls: ['./searcherProgramas.component.css'],
})
export class SearcherProgramasComponent implements OnInit {
  //@Input() buscador: number;
  //tablas = ["programas_academicos", "grupos_investigacion", "objetivos_desarrollo", "habilidades_sectores"];
  formatNumber = formatNumber;
  parseInt = parseInt;
  dimensiones_aux = ['*', 'R', 'I', 'A', 'S', 'E', 'C'];

  tabla = 'programas_academicos';
  form1: FormGroup;
  form2: FormGroup;
  error = false;

  ciudades1 = [];
  ciudades2 = [];

  ciudades_seleccionada1=null
  ciudades_seleccionada2=null

  ciudades_aux = {};
  universidades1 = [];
  universidades2 = [];

  programas1 = [];
  programas2 = [];

  programa1 = null;
  programa2 = null;

  tipo_programas1 = [];
  tipo_programas2 = [];

  tipo_programa1 = null;
  tipo_programa2 = null;
  programLocalStorage = this.getLocalStorage()
  dataLocalStorage: any;
  userInfo: any;
  userDescription: Object;
  userProfesion: Object;
  imageUrl: File;
  descriptionUser: string;
  profesionUser: string;
  profesionRecomend:any;

  constructor(private testService: TestService) {}

  ngOnInit() {
    // Obtener departamentos y ciudades.
    this.getFilterInfo('ciudades_programas', { value: '*' }).subscribe(
      (res) => {
        Object.keys(res).map((key) => {
          let ciudad = res[key].departamento + ': ' + res[key].ciudad;
          this.ciudades1.push(ciudad);
          this.ciudades2.push(ciudad);
          this.ciudades_aux[ciudad] = res[key].ciudad;
        });
      }
    )

    // Obtener universidades.
    this.getFilterInfo('universidades_programas', { ciudad: '*' }).subscribe(
      (res) => {
        Object.keys(res).map((key) => {
          this.universidades1.push(res[key].universidad);
          this.universidades2.push(res[key].universidad);
        });
      }
    );

    this.form1 = new FormGroup({
      dimension: new FormControl('0'),
      ciudad: new FormControl('0'),
      universidad: new FormControl('0'),
      tipo_programa: new FormControl('0'),
      programa: new FormControl('0'),
    });
    this.form2 = new FormGroup({
      dimension: new FormControl('0'),
      ciudad: new FormControl('0'),
      universidad: new FormControl('0'),
      tipo_programa: new FormControl('0'),
      programa: new FormControl('0'),
    });

    this.getLocalStorageInfo()
    const programLocalStorage = this.getLocalStorage()
    //este no es

    // this.form1.get("dimension").valueChanges.subscribe(val => {
    //    this.programa1 = null;
    //    if(parseInt(this.form1.get("ciudad").value) > 0 && parseInt(this.form1.get("universidad").value) > 0){
    //       this.form1.patchValue({"programa": "0"});
    //       this.form1.updateValueAndValidity();

    //       this.programas1 = [];
    //       let data = {};
    //       data["universidad"] = this.universidades1[parseInt(this.form1.get("universidad").value) - 1];
    //       data["dimension"] = this.dimensiones_aux[parseInt(this.form1.get("dimension").value)];
    //       data["tipo_programa"]  = this.tipo_programa1[parseInt(val) - 1];
    //       this.getFilterInfo("programas_academicos_de_universidad", data).subscribe((res) => {
    //         Object.keys(res).map((key) => {
    //           this.programas1.push(res[key].programa_academico);
    //         });
    //       });
    //     }
    // });

    //este no es

    // this.form2.get("dimension").valueChanges.subscribe(val => {
    //   this.programa2 = null;
    //    if(parseInt(this.form2.get("ciudad").value) > 0 && parseInt(this.form2.get("universidad").value) > 0){
    //       this.form2.patchValue({"programa": "0"});
    //       this.form2.updateValueAndValidity();
    //       this.programas2 = [];
    //       let data = {};
    //       data["universidad"] = this.universidades2[parseInt(this.form2.get("universidad").value) - 1];
    //       data["dimension"] = this.dimensiones_aux[parseInt(this.form2.get("dimension").value)];
    //       this.getFilterInfo("programas_academicos_de_universidad", data).subscribe((res) => {
    //         Object.keys(res).map((key) => {
    //           this.programas2.push(res[key].programa_academico);
    //         });
    //       });
    //     }
    // });

    this.form1.get('ciudad').valueChanges.subscribe((val) => {
      // Limpiar universidad y programa seleccionado.
      this.form1.patchValue({ universidad: '0', programa: '0' });
      this.form1.updateValueAndValidity();
      this.programa1 = null;

      // Actualizar lista de universidades de acuerdo a ciudad seleccionada.
      this.universidades1 = [];
      let ciudad = '';
      if (parseInt(val) > 0) {
        ciudad = this.ciudades_aux[this.ciudades1[parseInt(val) - 1]];
      } else {
        ciudad = '*';
      }
      this.ciudades_seleccionada1= ciudad
      console.log(this.ciudades_seleccionada1, 'estejshjdhd')
      this.getFilterInfo('universidades_programas', {
        ciudad: ciudad,
      }).subscribe((res) => {
        Object.keys(res).map((key) => {
          this.universidades1.push(res[key].universidad);
        });
      });
    });

    this.form2.get('ciudad').valueChanges.subscribe((val) => {
      // Limpiar universidad y programa seleccionado.
      this.form2.patchValue({ universidad: '0', programa: '0' });
      this.form2.updateValueAndValidity();
      this.programa2 = null;

      // Actualizar lista de universidades de acuerdo a ciudad seleccionada.
      this.universidades2 = [];
      let ciudad = '';
      if (parseInt(val) > 0) {
        ciudad = this.ciudades_aux[this.ciudades2[parseInt(val) - 1]];
      } else {
        ciudad = '*';
      }
      this.ciudades_seleccionada2= ciudad
      this.getFilterInfo('universidades_programas', {
        ciudad: ciudad,
      }).subscribe((res) => {
        Object.keys(res).map((key) => {
          this.universidades2.push(res[key].universidad);
        });
      });
    });

    //----------------------------------------------este es el que trae tipos de programas form1

    this.form1.get('universidad').valueChanges.subscribe((val) => {
      // Limpiar programa seleccionado.
      this.form1.patchValue({ tipo_programa: '0' });
      this.form1.updateValueAndValidity();
      this.tipo_programas1 = [];
      this.tipo_programas1 = null;

      // Actualizar lista de programas de acuerdo a universidad seleccionada.
      let universidad = '';
      if (parseInt(val) > 0) {
        universidad = this.universidades1[parseInt(val) - 1];
      } else {
        universidad = '*';
      }
      this.tipo_programas1 = [];
      let data = {};
      data['universidad'] = universidad;
      data['ciudad']=this.ciudades_seleccionada1
      data['dimension'] =
        this.dimensiones_aux[parseInt(this.form1.get('dimension').value)];
      this.getFilterInfo(
        'tipos_programas_academicos_de_universidad',
        data
      ).subscribe((res) => {
        Object.keys(res).map((key) => {
          this.tipo_programas1.push(res[key].tipo_programa);
        });
      });
    });

    //-------------------------------------------este es el que trae tipos de programas form2

    this.form2.get('universidad').valueChanges.subscribe((val) => {
      // Limpiar programa seleccionado.
      this.form2.patchValue({ tipo_programa: '0' });
      this.form2.updateValueAndValidity();
      this.tipo_programas2 = [];
      this.tipo_programas2 = null;

      // Actualizar lista de programas de acuerdo a universidad seleccionada.
      let universidad = '';
      if (parseInt(val) > 0) {
        universidad = this.universidades2[parseInt(val) - 1];
      } else {
        universidad = '*';
      }
      this.tipo_programas2 = [];
      let data = {};
      data['universidad'] = universidad;
      data['ciudad']=this.ciudades_seleccionada2
      data['dimension'] =
        this.dimensiones_aux[parseInt(this.form2.get('dimension').value)];
      this.getFilterInfo(
        'tipos_programas_academicos_de_universidad',
        data
      ).subscribe((res) => {
        Object.keys(res).map((key) => {
          this.tipo_programas2.push(res[key].tipo_programa);
        });
      });
    });

    //-------------------------------------------este es el que trae  programas form1

    this.form1.get('tipo_programa').valueChanges.subscribe((val) => {
      // Limpiar programa seleccionado.
      this.form1.patchValue({ programa: '0' });
      this.form1.updateValueAndValidity();
      this.programas1 = [];
      this.programa1 = null;
      // Actualizar lista de programas de acuerdo a universidad seleccionada.
      let tipo_programa_select = '';
      if (parseInt(val) > 0) {
        tipo_programa_select = this.tipo_programas1[parseInt(val) - 1];
      } else {
        tipo_programa_select = '*';
      }
      this.programas1 = [];
      let data = {};
      data['tipo_programa'] = tipo_programa_select;
      data['ciudad']=this.ciudades_seleccionada1
      data['dimension'] =
        this.dimensiones_aux[parseInt(this.form1.get('dimension').value)];
      data['universidad'] =
        this.universidades1[parseInt(this.form1.get('universidad').value) - 1];
      this.getFilterInfo('programas_academicos_de_universidad', data).subscribe(
        (res) => {
          Object.keys(res).map((key) => {
            this.programas1.push(res[key].programa_academico);
          });
        }
      );
    });

    //-------------------------------------------este es el que trae  programas form2

    this.form2.get('tipo_programa').valueChanges.subscribe((val) => {
      this.form2.patchValue({ programa: '0' });
      this.form2.updateValueAndValidity();
      this.programas2 = [];
      this.programa2 = null;
      // Actualizar lista de programas de acuerdo a universidad seleccionada.
      let tipo_programa_select = '';
      if (parseInt(val) > 0) {
        tipo_programa_select = this.tipo_programas2[parseInt(val) - 1];
      } else {
        tipo_programa_select = '*';
      }
      this.programas2 = [];

      let data = {};
      data['tipo_programa'] = tipo_programa_select;
      data['ciudad']=this.ciudades_seleccionada2
      data['dimension'] =
        this.dimensiones_aux[parseInt(this.form2.get('dimension').value)];
      data['universidad'] =
        this.universidades2[parseInt(this.form2.get('universidad').value) - 1];
      this.getFilterInfo('programas_academicos_de_universidad', data).subscribe(
        (res) => {
          Object.keys(res).map((key) => {
            this.programas2.push(res[key].programa_academico);
          });
        }
      );
    });


    this.form1.get("programa").valueChanges.subscribe(val => {
      if(parseInt(val) > 0){
         let programa = this.programas1[parseInt(val) - 1];
         let universidad = this.universidades1[parseInt(this.form1.get("universidad").value) - 1];
         let data = {};
         data = {"universidad" : universidad, "programa": programa};
         this.getFilterInfo("programa_universidad", data).subscribe((res) => {
           this.programa1 = res["0"];
         });
      }
   });



   this.form2.get("programa").valueChanges.subscribe(val => {
    if(parseInt(val) > 0){
      let programa = this.programas2[parseInt(val) - 1];
      let universidad = this.universidades2[parseInt(this.form2.get("universidad").value) - 1];
      let data = {};
      data = {"universidad" : universidad, "programa": programa};
      this.getFilterInfo("programa_universidad", data).subscribe((res) => {
        this.programa2 = res["0"];
        //console.log(Object.keys(this.programa2));
      });
   }
  });


  }




  onSave(data){
    const dataSend ={
      info:{
        info:data,
        userProfesion: this.profesionUser,
        description:this.descriptionUser,
        userPhoto: this.imageUrl,
        programs: this.profesionRecomend,
      }
    }
    localStorage.setItem('userdata', JSON.stringify(dataSend.info));
   this.testService.getInfoUser(dataSend).subscribe(
    (res) => {
      JSON.stringify(res)
    });
  }

  getFilterInfo(table: string, value: Object) {
    return this.testService.getFilterInfo(table, value,this.programLocalStorage );
  }
  getLocalStorage(){
    return localStorage.getItem('programa') 
  }

  getLocalStorageInfo() {
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


}

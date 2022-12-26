import {
  Component,
  HostListener,
  ViewChild,
  OnInit,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { MdbTableDirective } from 'angular-bootstrap-md';
import { TestService } from '../services/test.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-searcher-sectores',
  templateUrl: './searcher-sectores.component.html',
  styleUrls: ['./searcher-sectores.component.css'],
})
export class SearcherSectoresComponent implements OnInit {
  //area
  //sector_economico
  formatNumber = formatNumber;
  parseInt = parseInt;

  dimensiones_aux = {
    Realista: 'R',
    Investigador: 'I',
    Artístico: 'A',
    Social: 'S',
    Emprendedor: 'E',
    Convencional: 'C',
  };
  noResults = null;
  elements = null;
  form: FormGroup;
  error = false;

  dimensiones = [
    'Realista',
    'Investigador',
    'Artístico',
    'Social',
    'Emprendedor',
    'Convencional',
  ];
  dimensiones_seleccionadas = [];

  areas = [];
  areas_seleccionadas = [];

  nucleos = [];
  nucleos_seleccionadas = [];

  sectores = [];
  sectores_seleccionadas = [];
  programLocalStorage = this.getLocalStorage()

  constructor(private testService: TestService) {}

  ngOnInit() {
    this.form = new FormGroup({
      dimension: new FormControl('0'),
      nucleo: new FormControl('0'),
      sector: new FormControl('0'),
      area: new FormControl('0'),
    });

    //obtener data de local storage


    // const programLocalStorage = this.getLocalStorage()


    // console.log(programLocalStorage, 'este es el del programa')
    // Obtenner nucleos de conocimiento.
    this.getFilterInfo('nucleos', { value: '*' }).subscribe((res) => {
      Object.keys(res).map((key) => {;
        let area = res[key].nucleos_de_conocimiento;
        if(area !== null){
          this.nucleos.push(area);
        }
      });
    });

    // Obtenner ectores_economicos.
    this.getFilterInfo('sectores_economicos', { area: '*' }).subscribe(
      (res) => {
        Object.keys(res).map((key) => {
          let area = res[key].sectores_economicos;
          this.sectores.push(area);
        });
      }
    );

    // Obtener areas.
    this.getFilterInfo('areas', { value: '*' }).subscribe((res) => {

      Object.keys(res).map((key) => {
        let area = res[key].areas;
        this.areas.push(area);
      });
    });



    // seleccion de dimensiones.
    this.form.get('dimension').valueChanges.subscribe((val) => {
      if (val != '0') {
        let nombre_dimension = this.dimensiones[parseInt(val) - 1];
        this.dimensiones.splice(parseInt(val) - 1, 1);
        this.dimensiones_seleccionadas.push(nombre_dimension);
        this.form.patchValue({ dimension: '0' });
        this.form.updateValueAndValidity();
      }
    });

     // seleccion de nucleos.
     this.form.get('nucleo').valueChanges.subscribe((val) => {
      if (val !== '0' && val !== '1') {
        console.log(val,'entre')
        let nombre_nucleo = this.nucleos[parseInt(val) - 1];
        this.nucleos.splice(parseInt(val) - 1, 1);
        this.nucleos_seleccionadas.push(nombre_nucleo);
        this.form.patchValue({ nucleo: '0' });
        this.form.updateValueAndValidity();
      }
    });


       // seleccion de sectoress.
       this.form.get('sector').valueChanges.subscribe((val) => {
        if (val && val != '0') {
          let nombre_sector = this.sectores[parseInt(val) - 1];
          this.sectores.splice(parseInt(val) - 1, 1);
          this.sectores_seleccionadas.push(nombre_sector);
          this.form.patchValue({ sector: '0' });
          this.form.updateValueAndValidity();
        }
      });


   // seleccion de areas.
   this.form.get('area').valueChanges.subscribe((val) => {
    if (val && val != '0') {
      let nombre_area = this.areas[parseInt(val) - 1];
      this.areas.splice(parseInt(val) - 1, 1);
      this.areas_seleccionadas.push(nombre_area);
      this.form.patchValue({ area: '0' });
      this.form.updateValueAndValidity();
    }
  });


    // this.form.get('area').valueChanges.subscribe((val) => {
    //   if (val && val != '0') {
    //     let nombre_area = this.areas[parseInt(val) - 1];
    //     this.areas.splice(parseInt(val) - 1, 1);
    //     this.areas_seleccionadas.push(nombre_area);
    //     this.form.patchValue({ area: '0' });
    //     this.form.updateValueAndValidity();

    //     // Obtener sectores en dicha area.
    //     this.sectores = [];
    //     this.areas_seleccionadas.forEach((element) => {
    //       let nombre_area_filtro = element;
    //       //console.log("sectores", nombre_area_filtro);
    //       this.getFilterInfo('sectores_economicos', {
    //         area: nombre_area_filtro,
    //       }).subscribe((res) => {
    //         //console.log(res);
    //         Object.keys(res).map((key) => {
    //           this.sectores.push(res[key].sectores_economicos);
    //         });
    //       });
    //     });
    //   }
    // });


  }

  getLocalStorage(){
    return localStorage.getItem('programa') 
  }

  getFilterInfo(table: string, value: Object) {
    return this.testService.getFilterInfo(table, value,'pregrado');
  }

  onRemove(columna: string, index: string) {
    //console.log(columna);
    //console.log(index);
    this.noResults = false;
    if (columna == 'dimensiones') {
      let nombre_valor = this.dimensiones_seleccionadas[parseInt(index)];
      this.dimensiones_seleccionadas.splice(parseInt(index), 1);
      this.dimensiones.push(nombre_valor);
    }
    else if (columna == 'nucleos') {
      let nombre_valor = this.nucleos_seleccionadas[parseInt(index)];
      this.nucleos_seleccionadas.splice(parseInt(index), 1);
      this.nucleos.push(nombre_valor);
    }
    else if (columna == 'sectores') {
      let nombre_valor = this.sectores_seleccionadas[parseInt(index)];
      this.sectores_seleccionadas.splice(parseInt(index), 1);
      this.sectores.push(nombre_valor);
    }
    else if (columna == 'areas') {
      let nombre_valor = this.areas_seleccionadas[parseInt(index)];
      this.areas_seleccionadas.splice(parseInt(index), 1);
      this.areas.push(nombre_valor);
    } 
  }


  cleanFilters() {
    this.dimensiones_seleccionadas = [];
    this.areas_seleccionadas = [];
    this.sectores_seleccionadas = [];
    this.nucleos_seleccionadas = [];
    this.elements = null;
    this.noResults = false;
  }

  onFilter() {
    this.noResults = false;
    let new_dimensiones = [];
    this.dimensiones_seleccionadas.forEach((element) => {
      new_dimensiones.push(this.dimensiones_aux[element]);
    });
    let data = {};
    data['sectores'] = Object.assign({}, this.sectores_seleccionadas);
    data['areas'] = Object.assign({}, this.areas_seleccionadas);
    data['nucleos'] = Object.assign({}, this.nucleos_seleccionadas);
    data['dimensiones'] = Object.assign({}, new_dimensiones);
    //console.log(data);
    this.testService
      .getFilterInfo('filtrar_sectores_economicos', data, this.programLocalStorage)
      .subscribe((res) => {
        this.elements = res;
        if (this.elements.length == 0) {
          this.noResults = true;
        }
      });
  }
}

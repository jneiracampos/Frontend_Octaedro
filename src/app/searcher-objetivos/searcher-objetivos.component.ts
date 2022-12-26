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
  selector: 'app-searcher-objetivos',
  templateUrl: './searcher-objetivos.component.html',
  styleUrls: ['./searcher-objetivos.component.css'],
})
export class SearcherObjetivosComponent implements OnInit {
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  // elements: any = [];
  searchText: string = '';
  previous: string;
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
  objetivos_de_desarrollo = [];
  objetivos_de_desarrollo_seleccionadas = [];
  programLocalStorage = this.getLocalStorage()

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

  constructor(private testService: TestService) {}

  @HostListener('input') oninput() {
    this.searchItems();
  }

  ngOnInit() {
    this.form = new FormGroup({
      dimension: new FormControl('0'),
      objetivo: new FormControl('0'),
    });

    const programLocalStorage = this.getLocalStorage()

    // Obtener objetivos.
    // this.getFilterInfo('objetivos', '*').subscribe((res) => {
    //   let elements = {};
    //   Object.keys(res).map((key) => {
    //     let objetivo = res[key].objetivo;
    //     let descripcion = res[key].descripcion;
    //     let dimensiones = res[key].dimensiones;
    //   });
    // });

    this.getFilterInfo('objetivo', '*').subscribe((res) => {
      console.log(res, 'objetivos');
      Object.keys(res).map((key) => {
        let area = res[key].objetivo;
        this.objetivos_de_desarrollo.push(area);
      });
    });
    /*this.testService.getInfoTable("objetivos_desarrollo").subscribe((res) => {
      this.elements = res;
      console.log(this.elements);
      this.mdbTable.setDataSource(this.elements);
      this.previous = this.mdbTable.getDataSource();
    });*/

    //selccionar dimensiones
    this.form.get('dimension').valueChanges.subscribe((val) => {
      if (val != '0') {
        let nombre_nucleo = this.dimensiones[parseInt(val) - 1];
        this.dimensiones.splice(parseInt(val) - 1, 1);
        this.dimensiones_seleccionadas.push(nombre_nucleo);
        this.form.patchValue({ dimension: '0' });
        this.form.updateValueAndValidity();
      }
    });

    //selccionar dimensiones
    this.form.get('objetivo').valueChanges.subscribe((val) => {
      if (val != '0') {
        let nombre_nucleo = this.objetivos_de_desarrollo[parseInt(val) - 1];
        this.objetivos_de_desarrollo.splice(parseInt(val) - 1, 1);
        this.objetivos_de_desarrollo_seleccionadas.push(nombre_nucleo);
        this.form.patchValue({ objetivo: '0' });
        this.form.updateValueAndValidity();
      }
    });
  }

  onRemove(columna: string, index: string) {
    this.noResults = false;
    if (columna == 'dimensiones') {
      let nombre_valor = this.dimensiones_seleccionadas[parseInt(index)];
      this.dimensiones_seleccionadas.splice(parseInt(index), 1);
      this.dimensiones.push(nombre_valor);
    } else {
      let nombre_valor =
        this.objetivos_de_desarrollo_seleccionadas[parseInt(index)];
      this.objetivos_de_desarrollo_seleccionadas.splice(parseInt(index), 1);
      this.objetivos_de_desarrollo.push(nombre_valor);
    }
  }

  cleanFilters() {
    this.dimensiones_seleccionadas = [];
    this.objetivos_de_desarrollo_seleccionadas = [];
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
    data['objetivo'] = Object.assign({}, this.objetivos_de_desarrollo_seleccionadas);
    data['dimensiones'] = Object.assign({}, new_dimensiones);
    console.log(data, 'este el body')
    this.testService
      .getFilterInfo('objetivos', data,this. programLocalStorage)
      .subscribe((res) => {
        this.elements = res;
        if (this.elements.length == 0) {
          this.noResults = true;
        }
      });
  }


  searchItems() {
    const prev = this.mdbTable.getDataSource();
    //console.log(prev);
    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.elements = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.elements = this.mdbTable.searchLocalDataByMultipleFields(
        this.searchText,
        ['objetivo', 'descripcion']
      );
      this.mdbTable.setDataSource(prev);
    }
  }
  getLocalStorage(){
    return localStorage.getItem('programa') 
  }

  getFilterInfo(table: string, value: string) {
    return this.testService.getFilterInfo(table, value, this.programLocalStorage);
  }
}

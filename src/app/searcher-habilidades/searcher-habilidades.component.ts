import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-searcher-habilidades',
  templateUrl: './searcher-habilidades.component.html',
  styleUrls: ['./searcher-habilidades.component.css'],
})
export class SearcherHabilidadesComponent implements OnInit {
  dimensiones_aux = {
    Realista: 'R',
    Investigador: 'I',
    Artístico: 'A',
    Social: 'S',
    Emprendedor: 'E',
    Convencional: 'C',
  };
  noResults = false;
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

  habilidades = [];
  habilidades_seleccionadas = [];

  ocupaciones = [];
  ocupaciones_seleccionadas = [];

  cargos = [];
  cargos_seleccionadas = [];

  programLocalStorage = this.getLocalStorage();

  elements = null;

  constructor(private testService: TestService) {}

  ngOnInit() {
    this.form = new FormGroup({
      dimension: new FormControl('0'),
      habilidad: new FormControl('0'),
      ocupacion: new FormControl('0'),
      cargo: new FormControl('0'),
    });

    // Obtener habilidades.
    this.getFilterInfo('habilidades', { value: '*' }).subscribe((res) => {
      Object.keys(res).map((key) => {
        let habilidad = res[key].habilidad;
        if(habilidad !== null && habilidad !== "" ){
          this.habilidades.push(habilidad);
        }
      });
    });

    // Obtener ocupaciones.
    this.getFilterInfo('ocupaciones', { value: '*' }).subscribe((res) => {
      Object.keys(res).map((key) => {
        let ocupacion = res[key].ocupacion;
        this.ocupaciones.push(ocupacion);
      });
    });

    // Obtener posibles cargos.
    this.getFilterInfo('cargos', { value: '*' }).subscribe((res) => {
      Object.keys(res).map((key) => {
        let cargo = res[key].cargo;
        this.cargos.push(cargo);
      });
    });

    const programLocalStorage = this.getLocalStorage();

    this.form.get('dimension').valueChanges.subscribe((val) => {
      if (val != '0') {
        let nombre_dimension = this.dimensiones[parseInt(val) - 1];
        this.dimensiones.splice(parseInt(val) - 1, 1);
        this.dimensiones_seleccionadas.push(nombre_dimension);
        this.form.patchValue({ dimension: '0' });
        this.form.updateValueAndValidity();
      }
    });

    this.form.get('habilidad').valueChanges.subscribe((val) => {
      if (val && val != '0') {
        let nombre_habilidad = this.habilidades[parseInt(val) - 1];
        this.habilidades.splice(parseInt(val) - 1, 1);
        this.habilidades_seleccionadas.push(nombre_habilidad);
        this.form.patchValue({ habilidad: '0' });
        this.form.updateValueAndValidity();
      }
    });

    this.form.get('ocupacion').valueChanges.subscribe((val) => {
      if (val && val != '0') {
        let nombre_ocupacion = this.ocupaciones[parseInt(val) - 1];
        this.ocupaciones.splice(parseInt(val) - 1, 1);
        this.ocupaciones_seleccionadas.push(nombre_ocupacion);
        this.form.patchValue({ ocupacion: '0' });
        this.form.updateValueAndValidity();
      }
    });

    this.form.get('cargo').valueChanges.subscribe((val) => {
      if (val && val != '0') {
        let nombre_cargo =   this.cargos[parseInt(val) - 1];
        this.cargos.splice(parseInt(val) - 1, 1);
        this.cargos_seleccionadas.push(nombre_cargo);
        this.form.patchValue({ cargo: '0' });
        this.form.updateValueAndValidity();
      }
    });
  }

  getFilterInfo(table: string, value: Object) {
    return this.testService.getFilterInfo(
      table,
      value,
      this.programLocalStorage
    );
  }

  onRequest(number: Number) {
    let values: any;
    values = this.form.value;

    //return this.testService.getInfoTable(this.tabla, values.dimension, values.ciudad, values.universidad);
  }

  onRemove(columna: string, index: string) {
    //console.log(columna);
    //console.log(index);
    this.noResults = false;
    if (columna == 'dimensiones') {
      let nombre_valor = this.dimensiones_seleccionadas[parseInt(index)];
      this.dimensiones_seleccionadas.splice(parseInt(index), 1);
      this.dimensiones.push(nombre_valor);
    } else if (columna == 'habilidades') {
      let nombre_valor = this.habilidades_seleccionadas[parseInt(index)];
      this.habilidades_seleccionadas.splice(parseInt(index), 1);
      this.habilidades.push(nombre_valor);
    }
    else if (columna == 'ocupaciones') {
      let nombre_valor = this.ocupaciones_seleccionadas[parseInt(index)];
      this.ocupaciones_seleccionadas.splice(parseInt(index), 1);
      this.ocupaciones.push(nombre_valor);
    }
    else if (columna == 'cargos') {
      let nombre_valor = this.cargos_seleccionadas[parseInt(index)];
      this.cargos_seleccionadas.splice(parseInt(index), 1);
      this.cargos.push(nombre_valor);
    }
  }

  cleanFilters() {
    this.dimensiones = [
      'Realista',
      'Investigador',
      'Artístico',
      'Social',
      'Emprendedor',
      'Convencional',
    ];
    this.dimensiones_seleccionadas = [];

    ////// Obtener departamentos y ciudades.
    this.habilidades = [];

    this.getFilterInfo('habilidades', { value: '*' }).subscribe((res) => {
      Object.keys(res).map((key) => {
        let habilidad = res[key].habilidad;
        this.habilidades.push(habilidad);
      });
    });
    this.habilidades_seleccionadas = [];
    this.ocupaciones_seleccionadas = [];
    this.cargos_seleccionadas = [];
    this.dimensiones_seleccionadas = [];
    this.elements = null;
    this.noResults = false;
  }

  onFilter() {
    //console.log("Selección: ");
    //console.log(this.habilidades_seleccionadas);
    //console.log(this.dimensiones_seleccionadas);
    this.noResults = false;
    let new_dimensiones = [];
    this.dimensiones_seleccionadas.forEach((element) => {
      new_dimensiones.push(this.dimensiones_aux[element]);
    });
    let data = {};
    data['habilidades'] = Object.assign({}, this.habilidades_seleccionadas);
    data['dimensiones'] = Object.assign({}, new_dimensiones);
    data['ocupaciones'] = Object.assign({}, this.ocupaciones_seleccionadas);
    data['cargos'] = Object.assign({}, this.cargos_seleccionadas);
    //console.log(data);
    this.testService
      .getFilterInfo('filtrar_habilidades', data, this.programLocalStorage)
      .subscribe((res) => {
        this.elements = res;
        if (this.elements.length == 0) {
          this.noResults = true;
        }
      });
  }

  getLocalStorage() {
    return localStorage.getItem('programa');
  }
}

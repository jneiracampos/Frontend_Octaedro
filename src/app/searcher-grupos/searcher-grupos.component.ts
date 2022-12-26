import { Component, HostListener, ViewChild, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { TestService } from '../services/test.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-searcher-grupos',
  templateUrl: './searcher-grupos.component.html',
  styleUrls: ['./searcher-grupos.component.css']
})
export class SearcherGruposComponent implements OnInit {


  // borrar
  /*habilidades = ["Resolución de problemas complejos", 
                "Criterio y Toma de Decisiones", 
                "Comunicación asertiva",
                "Pensamiento crítico",
                "Evaluación y control de actividades",
                "Comprensión de lectura",
                "Escucha activa",
                "Relaciones interpersonales",
                "Trabajo en equipo",
                "Persuación",
                "Liderazgo",
                "Trabajo bajo presión", 
                "Gestión de Recursos de Personal",
                "Análisis de necesidades",
                "Vigilancia de las operaciones",
                "Redacción de textos",
                "Gestión del Tiempo",
                "Conciliación",
                "Orientación al Servicio",
                "Proactividad",
                "Evaluación y control de actividades",
                "Flexibilidad y adaptabilidad",
                "Lógica matemática",
                "Transmisión de conocimiento",
                "Estrategias para el aprendizaje"
              ];*/
  /*areas = [
    "Agroindustria", 
    "Ciencias de la Salud", 
    "Construcción",
  ];*/
  ///
  dimensiones_aux = {
    "Realista": "R",
    "Investigador": "I", 
    "Artístico": "A", 
    "Social": "S", 
    "Emprendedor": "E", 
    "Convencional": "C"
  } 
  elements = null;
  noResults = false;
  form: FormGroup;
  error = false;

  dimensiones = ["Realista", "Investigador", "Artístico", "Social", "Emprendedor", "Convencional"];
  dimensiones_seleccionadas = [];

  ciudades = [];
  ciudades_aux = {};
  ciudades_seleccionadas = [];

  universidades = [];
  universidades_seleccionadas = [];
  programLocalStorage = this.getLocalStorage()

  constructor(private testService: TestService) { }

  ngOnInit() {

    const programLocalStorage = this.getLocalStorage()

    this.form = new FormGroup({
      dimension: new FormControl("0"),
      ciudad: new FormControl("0"),
      universidad: new FormControl("0"),
    });

    // Obtener departamentos y ciudades.
    this.getFilterInfo("ciudades_grupos", {"value": "*"}).subscribe((res) => {
      //console.log(res);
      Object.keys(res).map((key) => {
        let ciudad = res[key].departamento + ": " + res[key].ciudad;
        this.ciudades.push(ciudad);
        this.ciudades_aux[ciudad] = res[key].ciudad;
      });
    });

    // Obtener universidades.
    this.getFilterInfo("universidades_programas", {"ciudad": "*"}).subscribe((res) => {
      //console.log(res);
      Object.keys(res).map((key) => {
        this.universidades.push(res[key].universidad);
      });
      //console.log(this.universidades);
    });

    this.form.get("dimension").valueChanges.subscribe(val => {
      if (val != "0") {
        let nombre_dimension = this.dimensiones[parseInt(val) - 1];
        this.dimensiones.splice(parseInt(val) - 1, 1);
        this.dimensiones_seleccionadas.push(nombre_dimension);
        this.form.patchValue({ "dimension": "0" });
        this.form.updateValueAndValidity();
      }
    });

    this.form.get("ciudad").valueChanges.subscribe(val => {
      if (val && val != "0") {
        let nombre_ciudad = this.ciudades[parseInt(val) - 1];
        this.ciudades.splice(parseInt(val) - 1, 1);
        this.ciudades_seleccionadas.push(nombre_ciudad);
        this.form.patchValue({ "ciudad": "0" });
        this.form.updateValueAndValidity();

        // Obtener universidades en dicha ciudad.
        this.universidades = [];
        /*this.universidades_seleccionadas = [];*/
        this.ciudades_seleccionadas.forEach((element) => {
          let nombre_ciudad_filtro = this.ciudades_aux[element];
          //console.log("universidades_programas", nombre_ciudad_filtro);
          this.getFilterInfo("universidades_programas", {"ciudad":nombre_ciudad_filtro}).subscribe((res) => {
            //console.log(res);
            Object.keys(res).map((key) => {
              this.universidades.push(res[key].universidad);
            });
          });
        });
      }
    });

    this.form.get("universidad").valueChanges.subscribe(val => {
      if (val && val != "0") {
        let nombre_universidad = this.universidades[parseInt(val) - 1];
        this.universidades.splice(parseInt(val) - 1, 1);
        this.universidades_seleccionadas.push(nombre_universidad);
        this.form.patchValue({ "universidad": "0" });
        this.form.updateValueAndValidity();
      }
    });

  }

  getFilterInfo(
    table: string,
    value: Object
  ) {
    return this.testService.getFilterInfo(table, value, this.programLocalStorage);
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
    if (columna == "dimensiones") {
      let nombre_valor = this.dimensiones_seleccionadas[parseInt(index)];
      this.dimensiones_seleccionadas.splice(parseInt(index), 1);
      this.dimensiones.push(nombre_valor);
    } else if (columna == "ciudades") {
      let nombre_valor = this.ciudades_seleccionadas[parseInt(index)];
      this.ciudades_seleccionadas.splice(parseInt(index), 1);
      this.ciudades.push(nombre_valor);
      if(this.ciudades_seleccionadas.length == 0){
        // Obtener lista completa de universidades.
        this.universidades = [];
        this.getFilterInfo("universidades_programas", {"ciudad" :"*"}).subscribe((res) => {
          Object.keys(res).map((key) => {
            this.universidades.push(res[key].universidad);
          });
          this.universidades_seleccionadas.forEach((element) => {
            let index = this.universidades.indexOf(element);
            this.universidades.splice(index, 1);
          })
        });


      }else{
        // Obtener lista de universidades con filtro de ciudades seleccionadas.
        this.universidades = [];
        this.ciudades_seleccionadas.forEach((element) => {
          let nombre_ciudad_filtro = this.ciudades_aux[element];
          //console.log("universidades_programas", nombre_ciudad_filtro);
          this.getFilterInfo("universidades_programas", {"ciudad": nombre_ciudad_filtro}).subscribe((res) => {
            //console.log(res);
            Object.keys(res).map((key) => {
              this.universidades.push(res[key].universidad);
            });
          });
        });
      }
    } else if (columna == "universidades") {
      let nombre_valor = this.universidades_seleccionadas[parseInt(index)];
      this.universidades_seleccionadas.splice(parseInt(index), 1);
      this.universidades.push(nombre_valor);
    }

  }

  cleanFilters() {
    this.dimensiones = ["Realista", "Investigador", "Artístico", "Social", "Emprendedor", "Convencional"];
    this.dimensiones_seleccionadas = [];

    ////// Obtener departamentos y ciudades.
    this.ciudades = [];
    this.ciudades_aux = {};
    this.getFilterInfo("ciudades_programas", {"value": "*"}).subscribe((res) => {
      Object.keys(res).map((key) => {
        let ciudad = res[key].departamento + ": " + res[key].ciudad;
        this.ciudades.push(ciudad);
        this.ciudades_aux[ciudad] = res[key].ciudad;
      });
    });
    this.ciudades_seleccionadas = [];

    ////// universidades
    this.universidades_seleccionadas = [];
    this.universidades = [];
    // Obtener lista completa de universidades.
    this.getFilterInfo("universidades_programas", {"ciudad": "*"}).subscribe((res) => {
      Object.keys(res).map((key) => {
        this.universidades.push(res[key].universidad);
      });
    });

    // Limpiar resultados.
    this.elements = null;
    this.noResults = false;
    
  }

  onFilter() {
    //console.log("Selección: ");
    //console.log(this.universidades_seleccionadas);
    //console.log(this.ciudades_seleccionadas);
    //console.log(this.dimensiones_seleccionadas);
    this.noResults = false;
    let new_ciudades = [];
    this.ciudades_seleccionadas.forEach((element) => {
        new_ciudades.push(this.ciudades_aux[element]);
    });   
    let new_dimensiones = [];
    this.dimensiones_seleccionadas.forEach((element) => {
      new_dimensiones.push(this.dimensiones_aux[element]);
    })
    let data = {};
    data["universidades"] = Object.assign({}, this.universidades_seleccionadas);
    data["ciudades"] = Object.assign({}, new_ciudades);
    data["dimensiones"] = Object.assign({}, new_dimensiones);
    //console.log(data);
    this.testService.getFilterInfo("filtrar_grupos_investigacion", data,this.programLocalStorage).subscribe((res) => {
       this.elements = res;
       if(this.elements.length == 0){
          this.noResults = true;
       }
       //console.log(this.elements);
    });
  }
  getLocalStorage(){
    return localStorage.getItem('programa') 
  }

}

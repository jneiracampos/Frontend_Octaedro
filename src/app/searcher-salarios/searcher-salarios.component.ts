import { Component, HostListener, ViewChild, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MdbTableDirective } from 'angular-bootstrap-md';
import { TestService } from '../services/test.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatNumber } from "@angular/common";


@Component({
  selector: 'app-searcher-salarios',
  templateUrl: './searcher-salarios.component.html',
  styleUrls: ['./searcher-salarios.component.css']
})
export class SearcherSalariosComponent implements OnInit {
  formatNumber = formatNumber;
  parseInt = parseInt;

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

  areas = [];
  areas_seleccionadas = [];

  cargos=[]
  cargos_selecionados=[]

  nivel_ocupaciones=[]
  nivel_ocupaciones_seleccionados=[]

  sectores = [];
  sectores_seleccionadas = [];

  industrias = [];
  industrias_seleccionadas = [];
  programLocalStorage = this.getLocalStorage()

  constructor(private testService: TestService) { }

  ngOnInit() {

    this.form = new FormGroup({
      dimension: new FormControl("0"),
      ocupacion: new FormControl("0"),
      industria: new FormControl("0"),
      sector: new FormControl("0"),
      cargo: new FormControl("0")
    });


    const programLocalStorage = this.getLocalStorage()

    
    // // Obtener areas.
    // this.getFilterInfo("area", {"value": "*"}).subscribe((res) => {
    //   console.log(res,'obtener areas');
    //   Object.keys(res).map((key) => {
    //     let area = res[key].area;
    //     this.areas.push(area);
    //   });
    // });

     // Obtener nievel de ocupacion.

     this.getFilterInfo("nivel", {"value": "*"}).subscribe((res) => {
      Object.keys(res).map((key) => {
        let area = res[key].nivel;
        this.nivel_ocupaciones.push(area);
      });
    });

     // Obtener idustrias
    
    this.getFilterInfo("industrias", {"value": "*"}).subscribe((res) => {
      Object.keys(res).map((key) => {
        let area = res[key].industrias;
        if(area !== null &&area !== '' ){
          this.industrias.push(area);
        }
      });
    });

    // Obtener sectores.
    this.getFilterInfo("sector", {"value": "*"}).subscribe((res) => {
      Object.keys(res).map((key) => {
        this.sectores.push(res[key].sector);
      });
      //console.log(this.sectores);
    });


      // Obtener cargos.
      this.getFilterInfo("cargo", {"value": "*"}).subscribe((res) => {
        Object.keys(res).map((key) => {
          this.cargos.push(res[key].cargo);
        });
        //console.log(this.sectores);
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

    this.form.get("cargo").valueChanges.subscribe(val => {
      if (val && val != "0") {
        let nombre_sector = this.cargos[parseInt(val) - 1];
        this.cargos.splice(parseInt(val) - 1, 1);
        this.cargos_selecionados.push(nombre_sector);
        this.form.patchValue({ "cargo": "0" });
        this.form.updateValueAndValidity();
      }
    });
    this.form.get("industria").valueChanges.subscribe(val => {
      if (val && val != "0") {
        let nombre_sector = this.industrias[parseInt(val) - 1];
        this.industrias.splice(parseInt(val) - 1, 1);
        this.industrias_seleccionadas.push(nombre_sector);
        this.form.patchValue({ "industria": "0" });
        this.form.updateValueAndValidity();
      }
    });
    this.form.get("sector").valueChanges.subscribe(val => {
      if (val && val != "0") {
        let nombre_sector = this.sectores[parseInt(val) - 1];
        this.sectores.splice(parseInt(val) - 1, 1);
        this.sectores_seleccionadas.push(nombre_sector);
        this.form.patchValue({ "sector": "0" });
        this.form.updateValueAndValidity();
      }
    });

    this.form.get("ocupacion").valueChanges.subscribe(val => {
      if (val && val != "0") {
        let nombre_sector = this.nivel_ocupaciones[parseInt(val) - 1];
        this.nivel_ocupaciones.splice(parseInt(val) - 1, 1);
        this.nivel_ocupaciones_seleccionados.push(nombre_sector);
        this.form.patchValue({ "ocupacion": "0" });
        this.form.updateValueAndValidity();
      }
    });

    // this.form.get("area").valueChanges.subscribe(val => {
    //   if (val && val != "0") {
    //     let nombre_area = this.areas[parseInt(val) - 1];
    //     this.areas.splice(parseInt(val) - 1, 1);
    //     this.areas_seleccionadas.push(nombre_area);
    //     this.form.patchValue({ "area": "0" });
    //     this.form.updateValueAndValidity();
    //     // Obtener sectores en dicha area.
    //     this.sectores = [];
    //     this.areas_seleccionadas.forEach((element) => {
    //       let nombre_area_filtro = element;
    //       //console.log("sectores", nombre_area_filtro);
    //       this.getFilterInfo("sector", {"area":nombre_area_filtro}).subscribe((res) => {
    //         //console.log(res);
    //         Object.keys(res).map((key) => {
    //           this.sectores.push(res[key].sector);
    //         });
    //       });
    //     });
    //   }
    // });


  }

  getFilterInfo(
    table: string,
    value: Object
  ) {
    return this.testService.getFilterInfo(table, value,this.programLocalStorage);
  }


  getLocalStorage(){
    return localStorage.getItem('programa') 
  }

  onRemove(columna: string, index: string) {
    this.noResults = false;
    if (columna == "dimensiones") {
      let nombre_valor = this.dimensiones_seleccionadas[parseInt(index)];
      this.dimensiones_seleccionadas.splice(parseInt(index), 1);
      this.dimensiones.push(nombre_valor); 
    }  else if (columna == "ocupaciones") {
      let nombre_valor = this.nivel_ocupaciones_seleccionados[parseInt(index)];
      this.nivel_ocupaciones_seleccionados.splice(parseInt(index), 1);
      this.nivel_ocupaciones.push(nombre_valor); 

    }else if (columna == "cargos") {
      let nombre_valor = this.cargos_selecionados[parseInt(index)];
      this.cargos_selecionados.splice(parseInt(index), 1);
      this.cargos.push(nombre_valor); 
    }
    else if (columna == "industrias") {
      let nombre_valor = this.industrias_seleccionadas[parseInt(index)];
      this.industrias_seleccionadas.splice(parseInt(index), 1);
      this.industrias.push(nombre_valor); 
    }
    else if (columna == "sectores") {
      let nombre_valor = this.sectores_seleccionadas[parseInt(index)];
      this.sectores_seleccionadas.splice(parseInt(index), 1);
      this.sectores.push(nombre_valor); 
    }
    
    // else if (columna == "areas") {
    //   let nombre_valor = this.areas_seleccionadas[parseInt(index)];
    //   this.areas_seleccionadas.splice(parseInt(index), 1);
    //   this.areas.push(nombre_valor);
    //   if(this.areas_seleccionadas.length == 0){
    //     // Obtener lista completa de sectores.
    //     this.sectores = [];
    //     this.getFilterInfo("sector", {"area" :"*"}).subscribe((res) => {
    //       Object.keys(res).map((key) => {
    //         this.sectores.push(res[key].sector);
    //       });
    //       this.sectores_seleccionadas.forEach((element) => {
    //         let index = this.sectores.indexOf(element);
    //         this.sectores.splice(index, 1);
    //       })
    //     });


    //   }else{
    //     // Obtener lista de sectores con filtro de areas seleccionadas.
    //     this.sectores = [];
    //     this.areas_seleccionadas.forEach((element) => {
    //       let nombre_area_filtro = element;
    //       //console.log("sectores", nombre_area_filtro);
    //       this.getFilterInfo("sector", {"area": nombre_area_filtro}).subscribe((res) => {
    //         //console.log(res);
    //         Object.keys(res).map((key) => {
    //           this.sectores.push(res[key].sector);
    //         });
    //       });
    //     });
    //   }
    // }

  }

  cleanFilters() {
    this.dimensiones_seleccionadas = [];
    this.cargos_selecionados=[]
    this.nivel_ocupaciones_seleccionados=[]
    this.sectores_seleccionadas = [];
    this.industrias_seleccionadas = [];
    this.elements = null;
    this.noResults = false;
  }

  onFilter() {
    this.noResults = false;
    let new_dimensiones = [];
    this.dimensiones_seleccionadas.forEach((element) => {
      new_dimensiones.push(this.dimensiones_aux[element]);
    })
    let data = {};
    data["sectores"] = Object.assign({}, this.sectores_seleccionadas);
    data["niveles"] = Object.assign({}, this.nivel_ocupaciones_seleccionados);
    data["cargos"] = Object.assign({}, this.cargos_selecionados);
    data["industrias"] = Object.assign({}, this.industrias_seleccionadas);
    data["dimensiones"] = Object.assign({}, new_dimensiones);
    //console.log(data);
    this.testService.getFilterInfo("filtrar_salarios", data,this.programLocalStorage).subscribe((res) => {
      this.elements = res;
      if(this.elements.length == 0){
        this.noResults = true;
      }
    });
  }

}

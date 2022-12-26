import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Test } from "../models/test.model";
import { Filter } from "../models/filter.model";
import { Info } from "../models/info.model";
import { Encuesta } from '../models/encuesta.model';
import { compileInjectable } from '@angular/compiler';
 
@Injectable({providedIn: 'root'})
export class TestService {

    endpoint: String = environment.endpoint;

    constructor(private http: HttpClient) { }

    sendTest(
        parteA_arr: Array<number>,
        parteB_arr: Array<number>,
        parteC_arr: Array<number>,
        parteD_arr: Array<number>,
        parteActividades_arr: Array<number>, 
        parteHabilidades_arr: Array<number>, 
        parteOcupaciones_arr: Array<number>, 
        auto1_arr: Array<number>, 
        auto2_arr: Array<number>, 
        total_arr: Array<number>
      ){
        // Parte A.
        let mapa_parteA = new Object();
        mapa_parteA["real"] = parteA_arr[0];
        mapa_parteA["investigador"] = parteA_arr[1];
        mapa_parteA["social"] = parteA_arr[2];
        mapa_parteA["emprendedor"] = parteA_arr[3];
        mapa_parteA["artista"] = parteA_arr[4];
        mapa_parteA["convencional"] = parteA_arr[5];
        mapa_parteA["index"] = 1;

        // Parte B.
        let mapa_parteB = new Object();
        mapa_parteB["real"] = parteB_arr[0];
        mapa_parteB["investigador"] = parteB_arr[1];
        mapa_parteB["social"] = parteB_arr[2];
        mapa_parteB["emprendedor"] = parteB_arr[3];
        mapa_parteB["artista"] = parteB_arr[4];
        mapa_parteB["convencional"] = parteB_arr[5];
        mapa_parteB["index"] = 2;

        // Parte C.
        let mapa_parteC = new Object();
        mapa_parteC["real"] = parteC_arr[0];
        mapa_parteC["investigador"] = parteC_arr[1];
        mapa_parteC["social"] = parteC_arr[2];
        mapa_parteC["emprendedor"] = parteC_arr[3];
        mapa_parteC["artista"] = parteC_arr[4];
        mapa_parteC["convencional"] = parteC_arr[5];
        mapa_parteC["index"] = 3;

        // Parte D.
        let mapa_parteD = new Object();
        mapa_parteD["real"] = parteD_arr[0];
        mapa_parteD["investigador"] = parteD_arr[1];
        mapa_parteD["social"] = parteD_arr[2];
        mapa_parteD["emprendedor"] = parteD_arr[3];
        mapa_parteD["artista"] = parteD_arr[4];
        mapa_parteD["convencional"] = parteD_arr[5];
        mapa_parteD["index"] = 4;

        // Parte Actividades.
        let mapa_parteActividades = new Object();
        mapa_parteActividades["real"] = parteActividades_arr[0];
        mapa_parteActividades["investigador"] = parteActividades_arr[1];
        mapa_parteActividades["social"] = parteActividades_arr[2];
        mapa_parteActividades["emprendedor"] = parteActividades_arr[3];
        mapa_parteActividades["artista"] = parteActividades_arr[4];
        mapa_parteActividades["convencional"] = parteActividades_arr[5];
        mapa_parteActividades["index"] = 5;

        // Parte Habilidades.
        let mapa_parteHabilidades = new Object();
        mapa_parteHabilidades["real"] = parteHabilidades_arr[0];
        mapa_parteHabilidades["investigador"] = parteHabilidades_arr[1];
        mapa_parteHabilidades["social"] = parteHabilidades_arr[2];
        mapa_parteHabilidades["emprendedor"] = parteHabilidades_arr[3];
        mapa_parteHabilidades["artista"] = parteHabilidades_arr[4];
        mapa_parteHabilidades["convencional"] = parteHabilidades_arr[5];
        mapa_parteHabilidades["index"] = 6;

        // Parte Ocupaciones.
        let mapa_parteOcupaciones = new Object();
        mapa_parteOcupaciones["real"] = parteOcupaciones_arr[0];
        mapa_parteOcupaciones["investigador"] = parteOcupaciones_arr[1];
        mapa_parteOcupaciones["social"] = parteOcupaciones_arr[2];
        mapa_parteOcupaciones["emprendedor"] = parteOcupaciones_arr[3];
        mapa_parteOcupaciones["artista"] = parteOcupaciones_arr[4];
        mapa_parteOcupaciones["convencional"] = parteOcupaciones_arr[5];
        mapa_parteOcupaciones["index"] = 7;

        // Parte Autoevaluación 1.
        let mapa_auto1 = new Object();
        mapa_auto1["real"] = auto1_arr[0];
        mapa_auto1["investigador"] = auto1_arr[1];
        mapa_auto1["social"] = auto1_arr[2];
        mapa_auto1["emprendedor"] = auto1_arr[3];
        mapa_auto1["artista"] = auto1_arr[4];
        mapa_auto1["convencional"] = auto1_arr[5];
        mapa_auto1["index"] = 8;

        // Parte Autoevaluación 2.
        let mapa_auto2 = new Object();
        mapa_auto2["real"] = auto2_arr[0];
        mapa_auto2["investigador"] = auto2_arr[1];
        mapa_auto2["social"] = auto2_arr[2];
        mapa_auto2["emprendedor"] = auto2_arr[3];
        mapa_auto2["artista"] = auto2_arr[4];
        mapa_auto2["convencional"] = auto2_arr[5];
        mapa_auto2["index"] = 9;

        // Total arr.
        let mapa_total = new Object();
        mapa_total["real"] = total_arr[0];
        mapa_total["investigador"] = total_arr[1];
        mapa_total["social"] = total_arr[2];
        mapa_total["emprendedor"] = total_arr[3];
        mapa_total["artista"] = total_arr[4];
        mapa_total["convencional"] = total_arr[5];
        mapa_total["index"] = 10;

        const testData: Test = {
            parteA_arr: mapa_parteA,
            parteB_arr: mapa_parteB,
            parteC_arr: mapa_parteC,
            parteD_arr: mapa_parteD,
            parteActividades_arr: mapa_parteActividades,
            parteHabilidades_arr: mapa_parteHabilidades,
            parteOcupaciones_arr: mapa_parteOcupaciones,
            auto1_arr: mapa_auto1,
            auto2_arr: mapa_auto2, 
            total_arr: mapa_total
        }
        //console.log("Test results");
        //console.log(testData);
        return this.http.post<{message: string, status: Number}>(this.endpoint + "/api/test/send", testData);
    }

    getTest(){
        return this.http.get(this.endpoint + "/api/test/get");
    }

    getPrediction(){
        return this.http.get(this.endpoint + "/api/test/predict");
    }

    getFilterInfo(tabla: string, value: Object, program_type:string){
        const infoData: Info = {
            tabla: tabla, 
            value: value,
            program_type:program_type
        }
        //console.log(this.endpoint + "/api/test/getFilterInfo");
        return this.http.post(this.endpoint + "/api/test/getFilterInfo", infoData);
    }


    getInfoUser(data){
        const infoData: Info = data
        return this.http.post(this.endpoint + "/api/users/info", infoData);
    }



    sendSurvey(
        nombreInstitucion: String, 
        estratoSocioeconomico: String,
        genero: String,
        rangoEdades: String, 
        preferenciaEstudiosSuperiores: String,
        asignaturaFilosofiaYLiteratura: String, 
        asignaturaMatematicas: String,
        asignaturaSocialesYCiudadanas: String, 
        asignaturaCienciasNaturales: String, 
        asignaturaIdiomas: String, 
        asignaturaDeportes: String, 
        asignaturaArtesYDanza: String
    ){
        const encuestaData: Encuesta = {
            nombreInstitucion, 
            estratoSocioeconomico, 
            genero, 
            rangoEdades, 
            preferenciaEstudiosSuperiores, 
            asignaturaFilosofiaYLiteratura, 
            asignaturaMatematicas, 
            asignaturaSocialesYCiudadanas, 
            asignaturaCienciasNaturales, 
            asignaturaIdiomas, 
            asignaturaDeportes, 
            asignaturaArtesYDanza
        }
        return this.http.post(this.endpoint + "/api/test/send-survey", encuestaData);
    }
}
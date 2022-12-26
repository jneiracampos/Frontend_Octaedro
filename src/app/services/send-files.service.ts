import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
 
@Injectable({providedIn: 'root'})
export class SendFilesService {

    endpoint: String = environment.endpoint;

    constructor(private http: HttpClient) { }

    /*postFile(
        claimTitle: string, 
        claimType: string, 
        victimsName: string, 
        victimizersName: string, 
        datetimeInput: string, 
        department: string, 
        town: string, 
        directions: string, 
        claimDescription: string, 
        files: Array<File>, 
        recaptcha: string,
      ){

        // Load files to IPFS.

        const data = new FormData();
        data.append("claimTitle", claimTitle);
        data.append("claimType", claimType);
        data.append("victimsName", victimsName);
        data.append("victimizersName", victimizersName);
        data.append("datetimeInput", datetimeInput);
        data.append("department", department);
        data.append("town", town);
        data.append("directions", directions);
        data.append("claimDescription", claimDescription);
        data.append("recaptcha", recaptcha);
        /*for(let file of files) {
          data.append("files", file, file.name);
        }*/

        //console.log("We will send this data to the server...")
        //console.log(data)
        //console.log("Sending this info to the server...")
        //return this.http.post<{status: Number}>(this.endpoint + "/post_claim", data);
        //return this.http.post<{status: Number, email: string, file_name: string, partial: boolean}>("http://localhost:4000/analyze_documents", data);
      //}

}
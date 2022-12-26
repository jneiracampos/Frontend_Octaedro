import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Contact } from '../models/contact.model';


@Injectable({providedIn: 'root'})
export class SendEmailService {

    endpoint: String = environment.endpoint;

    constructor(private http: HttpClient) { }

    sendEmail(
        name: string, 
        email: string, 
        subject: string, 
        message: string, 
        recaptcha: string
      ){
        const contactData: Contact = {
          name: name,
          email: email, 
          subject: subject,
          message: message,
          recaptcha: recaptcha
        }
        //console.log("enviar info contacto al server...")
        //console.log(contactData);
        return this.http.post<{status: Number}>(this.endpoint + "/api/contact", contactData);
    }

}
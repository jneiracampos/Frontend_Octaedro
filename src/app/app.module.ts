import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminBaseComponent } from "./adminBase/adminBase.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { HeaderAdminComponent } from './headerAdmin/headerAdmin.component';
import { TestComponent } from './test/test.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ProfileComponent } from './profile/profile.component';
import { ContactComponent } from './contact/contact.component';
import { ReactiveFormsModule } from "@angular/forms";
/*import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";*/
import { RecaptchaModule } from "ng-recaptcha";
import { LottieModule } from "ngx-lottie";
import player from "lottie-web";
import { CompanyServicesComponent } from './company-services/company-services.component';
import { TestInfoComponent } from './test-info/test-info.component';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { AddUserComponent } from './add-user/add-user.component';
import { MDBBootstrapModule } from "angular-bootstrap-md";
import { FormsModule } from "@angular/forms";
import { SearcherProgramasComponent } from './searcher-programas/searcherProgramas.component';
import { SearcherGruposComponent } from './searcher-grupos/searcher-grupos.component';
import { SearcherObjetivosComponent } from './searcher-objetivos/searcher-objetivos.component';
import { SearcherHabilidadesComponent } from './searcher-habilidades/searcher-habilidades.component';
import { SearcherSalariosComponent } from './searcher-salarios/searcher-salarios.component';
import { SearcherSectoresComponent } from './searcher-sectores/searcher-sectores.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CookiesComponent } from './cookies/cookies.component';
import { PoliticasComponent } from './politicas/politicas.component';
import { EncuestaComponent } from './encuesta/encuesta.component';

export function playerFactory(){
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    AdminBaseComponent,
    FooterComponent,
    MainpageComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    HeaderAdminComponent,
    TestComponent,
    DashboardComponent,
    ChangePasswordComponent,
    RecoverPasswordComponent,
    ProfileComponent,
    ContactComponent,
    CompanyServicesComponent,
    TestInfoComponent,
    AddUserComponent,
    SearcherProgramasComponent,
    SearcherGruposComponent,
    SearcherObjetivosComponent,
    SearcherHabilidadesComponent,
    SearcherSalariosComponent,
    SearcherSectoresComponent,
    CookiesComponent,
    PoliticasComponent,
    EncuestaComponent
  ],
  imports: [
    BrowserModule, 
    HttpClientModule, 
    ReactiveFormsModule, 
    AppRoutingModule, 
    ReactiveFormsModule, 
    RecaptchaModule,
    LottieModule.forRoot({ player: playerFactory }),
    MDBBootstrapModule.forRoot(),
    FormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}, 
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
